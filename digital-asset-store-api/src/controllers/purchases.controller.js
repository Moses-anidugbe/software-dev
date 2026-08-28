const purchasesService = require("../services/purchases.service");

async function purchaseProduct(req, res, next) {
  try {
    const productId =
      req.params.id || req.params.productId || req.body.productId;
    const result = await purchasesService.purchaseProduct({
      buyerId: req.user.id,
      productId: parseInt(productId, 10),
    });

    res.status(201).json({
      success: true,
      message: `Product with ID ${productId} purchased successfully.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getPurchases(req, res, next) {
  try {
    const purchases = await purchasesService.getPurchasesByBuyerId(req.user.id);
    res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  purchaseProduct,
  getPurchases,
};
