const main = require('../src/best-charge');
const {buildFormattedItem,buildItemwithDetail,unDiscountTotal,ThirtyMinusSixSave,getSpceialItems} = require('../src/best-charge');
const {loadAllItems} = require('../src/items');
const {loadPromotions} = require('../src/promotions');

describe('Take out food', function () {
  it ('format the inputs--buildFormattedItem()',function(){
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let format = buildFormattedItem(inputs);
    let expected = '[{"id":"ITEM0001","count":1},{"id":"ITEM0013","count":2},{"id":"ITEM0022","count":1}]';
    expect(JSON.stringify(format)).toEqual(expected);

  });

  it ('detail of items--buildItemwithDetail()',function(){
    let inputs = [{"id":"ITEM0001","count":1},{"id":"ITEM0013","count":2},{"id":"ITEM0022","count":1}];
    let itemdetail = buildItemwithDetail(inputs,loadAllItems());
    let expected = `[{"id":"ITEM0001","name":"黄焖鸡","price":"18.00","count":1,"subtotal":18},{"id":"ITEM0013","name":"肉夹馍","price":"6.00","count":2,"subtotal":12},{"id":"ITEM0022","name":"凉皮","price":"8.00","count":1,"subtotal":8}]`;
    expect(JSON.stringify(itemdetail)).toEqual(expected);

  });

  it ('total price of undiscount--unDiscountTotal()',function(){
    let inputs = [{"id":"ITEM0001","name":"黄焖鸡","price":"18.00","count":1,"subtotal":18},{"id":"ITEM0013","name":"肉夹馍","price":"6.00","count":2,"subtotal":12},{"id":"ITEM0022","name":"凉皮","price":"8.00","count":1,"subtotal":8}];
    let unDiscountTotalPrice = unDiscountTotal(inputs);
    let expected = 38;
    expect(unDiscountTotalPrice).toEqual(expected);

  });

  it ('30-6Save--ThirtyMinusSixSave()',function(){
    let inputs = 38;
    let ThirtyMinusSixSavePrice = ThirtyMinusSixSave(inputs);
    let expected = 6;
    expect(ThirtyMinusSixSavePrice).toEqual(expected);

  });

  it ('get spceial items --getSpceialItems()',function(){
    let SpceialItems = getSpceialItems(loadPromotions());
    let expected = ['ITEM0001', 'ITEM0022'];
    expect(SpceialItems).toEqual(expected);

  });



//   it('should generate best charge when best is 指定菜品半价', function() {
//     let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
//     let summary = bestCharge(inputs).trim();
//     let expected = `
// ============= 订餐明细 =============
// 黄焖鸡 x 1 = 18元
// 肉夹馍 x 2 = 12元
// 凉皮 x 1 = 8元
// -----------------------------------
// 使用优惠:
// 指定菜品半价(黄焖鸡，凉皮)，省13元
// -----------------------------------
// 总计：25元
// ===================================`.trim()
//     expect(summary).toEqual(expected)
//   });

//   it('should generate best charge when best is 满30减6元', function() {
//     let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
//     let summary = bestCharge(inputs).trim();
//     let expected = `
// ============= 订餐明细 =============
// 肉夹馍 x 4 = 24元
// 凉皮 x 1 = 8元
// -----------------------------------
// 使用优惠:
// 满30减6元，省6元
// -----------------------------------
// 总计：26元
// ===================================`.trim()
//     expect(summary).toEqual(expected)
//   });

//   it('should generate best charge when no promotion can be used', function() {
//     let inputs = ["ITEM0013 x 4"];
//     let summary = bestCharge(inputs).trim();
//     let expected = `
// ============= 订餐明细 =============
// 肉夹馍 x 4 = 24元
// -----------------------------------
// 总计：24元
// ===================================`.trim()
//     expect(summary).toEqual(expected)
//   });

});