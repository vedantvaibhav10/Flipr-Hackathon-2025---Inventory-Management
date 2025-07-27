const openai = require('../services/openai.service');
const Product = require('../models/product.model');
const Supplier = require('../models/supplier.model');
const Order = require('../models/order.model');
const InventoryLog = require('../models/inventoryLog.model');

const getReorderSuggestion = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        
        const salesLogs = await InventoryLog.find({ product: productId, actionType: 'SALE' }).sort({ createdAt: -1 }).limit(50);
        const totalSold = salesLogs.reduce((acc, log) => acc + Math.abs(log.quantityChange), 0);

        const prompt = `Product '${product.name}' (SKU: ${product.sku}) is low on stock with only ${product.stockLevel} units remaining. In the recent past, ${totalSold} units were sold. Generate a concise reorder suggestion, including a recommended order quantity to maintain a 45-day supply, assuming the sales trend continues.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const suggestion = response.choices[0].message.content.trim();
        res.status(200).json({ success: true, suggestion });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate reorder suggestion.' });
    }
};

const getSupplierAnalysis = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found.' });
        }

        const orders = await Order.find({ supplier: supplierId });
        const orderSummary = {
            totalOrders: orders.length,
            delivered: orders.filter(o => o.status === 'Delivered').length,
            cancelled: orders.filter(o => o.status === 'Cancelled').length,
            returned: orders.filter(o => o.status === 'Returned').length,
        };

        const prompt = `Analyze the performance of supplier '${supplier.name}'. Their order history shows: ${orderSummary.totalOrders} total orders, with ${orderSummary.delivered} delivered, ${orderSummary.cancelled} cancelled, and ${orderSummary.returned} returned. Generate a brief, one-paragraph performance summary highlighting their reliability and mentioning any potential concerns.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const analysis = response.choices[0].message.content.trim();
        res.status(200).json({ success: true, analysis });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate supplier analysis.' });
    }
};

const getPricingSuggestion = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        const salesLogs = await InventoryLog.find({ product: productId, actionType: 'SALE' }).sort({ createdAt: -1 }).limit(50);
        const totalSold = salesLogs.reduce((acc, log) => acc + Math.abs(log.quantityChange), 0);
        const profitMargin = product.sellingPrice - product.buyingPrice;

        const prompt = `Analyze the pricing for '${product.name}'. Its current buying price is $${product.buyingPrice} and selling price is $${product.sellingPrice}, resulting in a profit margin of $${profitMargin}. It has recently sold ${totalSold} units. Is the current price optimal? Suggest if the price should be maintained, increased, or decreased to maximize profit, and provide a brief justification.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const suggestion = response.choices[0].message.content.trim();
        res.status(200).json({ success: true, suggestion });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate pricing suggestion.' });
    }
};

const handleChatQuery = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, message: 'A message is required.' });
        }

        const lowStockProducts = await Product.find({ $expr: { $lt: ["$stockLevel", "$threshold"] } }).select('name stockLevel threshold').lean();
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('product', 'name').select('status product quantity').lean();
        const totalProducts = await Product.countDocuments();
        const totalSuppliers = await Supplier.countDocuments();

        const context = `
            You are an expert inventory management assistant named 'InvTrack AI'.
            Answer the user's question based ONLY on the following live data from the database.
            Keep your answers concise and friendly.

            --- LIVE DATA ---
            Current Date: ${new Date().toLocaleDateString()}
            Total Products in Inventory: ${totalProducts}
            Total Suppliers: ${totalSuppliers}
            Low Stock Products: ${JSON.stringify(lowStockProducts)}
            Recent Orders: ${JSON.stringify(recentOrders)}
            --- END LIVE DATA ---
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: context },
                { role: "user", content: message }
            ],
        });

        const reply = response.choices[0].message.content.trim();
        res.status(200).json({ success: true, reply });

    } catch (error) {
        console.error("Chatbot error:", error);
        res.status(500).json({ success: false, message: 'The AI assistant is currently unavailable.' });
    }
};

const handleNaturalLanguageSearch = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required.' });
        }

        const prompt = `
            You are a database query assistant. A user has sent the following natural language search query: "${query}".
            Your task is to convert this query into a structured JSON object that can be used to query a MongoDB database.
            The available collections are 'products' and 'suppliers'.
            For products, you can filter by 'category', 'name', or stock status ('low' or 'healthy').
            For suppliers, you can filter by 'name'.
            If the query seems to ask for a general summary or a question you can answer directly, respond with a direct text answer.

            Respond with ONLY the JSON object.

            Examples:
            - User query: "show me all low stock beverages" -> {"collection": "products", "filters": {"category": "Beverages", "stockStatus": "low"}}
            - User query: "find the supplier named Global Foods" -> {"collection": "suppliers", "filters": {"name": "Global Foods"}}
            - User query: "how many total products do we have?" -> {"answer": "I can find that out for you. One moment..."}
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const aiResponse = JSON.parse(response.choices[0].message.content.trim());

        if (aiResponse.answer) {
            return res.json({ success: true, type: 'answer', data: aiResponse.answer });
        }

        let results = [];
        if (aiResponse.collection === 'products') {
            const mongoQuery = {};

            if (aiResponse.filters) {
                if (aiResponse.filters.category && typeof aiResponse.filters.category === 'string') {
                    mongoQuery.category = { $regex: aiResponse.filters.category, $options: 'i' };
                }
                if (aiResponse.filters.name && typeof aiResponse.filters.name === 'string') {
                    mongoQuery.name = { $regex: aiResponse.filters.name, $options: 'i' };
                }
                if (aiResponse.filters.stockStatus === 'low') {
                    mongoQuery.$expr = { $lt: ["$stockLevel", "$threshold"] };
                }
                if (aiResponse.filters.stockStatus === 'healthy') {
                    mongoQuery.$expr = { $gte: ["$stockLevel", "$threshold"] };
                }
            }

            results = await Product.find(mongoQuery).limit(10);
        } else if (aiResponse.collection === 'suppliers') {
            const mongoQuery = {};
            if (aiResponse.filters && aiResponse.filters.name && typeof aiResponse.filters.name === 'string') {
                mongoQuery.name = { $regex: aiResponse.filters.name, $options: 'i' };
            }
            results = await Supplier.find(mongoQuery).limit(10);
        }

        res.json({ success: true, type: 'results', data: results, collection: aiResponse.collection });

    } catch (error) {
        console.error("AI Search error:", error);
        res.status(500).json({ message: 'AI search failed.' });
    }
};

module.exports = {
    getReorderSuggestion,
    getSupplierAnalysis,
    getPricingSuggestion,
    handleChatQuery,
    handleNaturalLanguageSearch
};
