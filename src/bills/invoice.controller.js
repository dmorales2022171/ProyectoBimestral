import Product from '../products/product.model.js';
import Invoice from '../bills/invoice.model.js';
import User from '../users/user.model.js';


export const invoicePost = async (req, res) => {
    const data = req.body;

    try {
        const user = await User.findOne({ _id: data.user });
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        const products = data.products;

        for (const productInfo of products) {
            const product = await Product.findById(productInfo.product);
            if (!product) {
                return res.status(404).json({
                    msg: `Product with ID ${productInfo.product} not found`
                });
            }
            if (productInfo.quantity > product.stock) {
                return res.status(400).json({
                    msg: `Quantity exceeds available stock for product ${product.productName}`
                });
            }
        }

        const total = products.reduce((acc, productInfo) => {
            return acc + productInfo.price * productInfo.quantity;
        }, 0);

        const invoice = new Invoice({
            user: user._id,
            products: data.products,
            total: total
        });

        await invoice.save();

        // Actualizar el stock de los productos
        for (const productInfo of products) {
            const product = await Product.findById(productInfo.product);
            product.stock -= productInfo.quantity;
            await product.save();
        }

        return res.status(200).json({
            user: user.name,
            invoice
        });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};

