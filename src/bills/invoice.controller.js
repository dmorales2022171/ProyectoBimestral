import Product from '../products/product.model.js';
import Invoice from '../bills/invoice.model.js';
import User from '../users/user.model.js';

export const invoicePost = async (req, res) => {
    const data = req.body;

    try {
        const user = await User.findOne({ mail: data.user });

        if (!user) {
            return res.status(404).json({
                msg: 'User not found'
            });
        }

        const invoiceProducts = [];
        let total = 0;

        for (const item of data.products) {
            const product = await Product.findOne({ productName: item.product });

            if (!product) {
                return res.status(404).json({
                    msg: `Product "${item.product}" not found`
                });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({
                    msg: `Quantity of "${item.product}" cannot be greater than stock`
                });
            }

            const productTotal = item.quantity * item.price;
            total += productTotal;

            invoiceProducts.push({
                product: product._id,
                quantity: item.quantity,
                price: item.price,
                productName: product.productName
            });

            product.stock -= item.quantity;
            await product.save();
        }

        const invoice = new Invoice({
            products: invoiceProducts,
            user: user._id,
            total: total
        });

        await invoice.save();

        const userEmail = user.mail;

        res.status(200).json({
            invoice: {
                date: invoice.date,
                _id: invoice._id,
                user: userEmail,
                products: invoiceProducts.map(product => ({
                    product: product.productName,
                    quantity: product.quantity,
                    price: product.price
                })),
                total: total
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

export const invoiceGet = async (req, res) => {
    try {
        const userId = req.user.id;
        const invoices = await Invoice.find({ user: userId });
        const mappedInvoices = await Promise.all(invoices.map(async (invoice) => {
            const user = await User.findById(invoice.user);
            const userEmail = user ? user.mail : 'Unknown';

            const products = await Promise.all(invoice.products.map(async (product) => {
                const productInfo = await Product.findById(product.product);
                const productName = productInfo ? productInfo.productName : 'Unknown';
                return {
                    quantity: product.quantity,
                    price: product.price,
                    productName: productName
                };
            }));

            return {
                _id: invoice._id,
                user: userEmail,
                products: products,
                total: invoice.total
            };
        }));

        res.status(200).json({
            invoices: mappedInvoices
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

export const invoicePut = async (req, res) => {
    try {
        const user = await User.findById(req.body.user);
    
        if (!user) {
            return res.status(404).json({
                msg: 'User not found'
            });
        }

        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, { user: req.body.user, ...req.body }, { new: true });
    
        if (!updatedInvoice) {
            return res.status(404).json({
                msg: 'Invoice not found'
            });
        }
    
        res.status(200).json({
            msg: 'Invoice updated successfully',
            invoice: updatedInvoice
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};
