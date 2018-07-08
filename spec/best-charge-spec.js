const main = require('../src/best-charge');
const {buildFormattedItem,buildItemwithDetail,unDiscountTotal,ThirtyMinusSixSave,getSpceialItems,SpceialItemSave,selectPromotionProject,CalTotalItem,formarttedList,bestCharge} = require('../src/best-charge');
const {loadAllItems} = require('../src/items');
const {loadPromotions} = require('../src/promotions');
//1.格式化菜品
describe('Take out food', function () {
  it ('format the inputs--buildFormattedItem()',function(){
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let format = buildFormattedItem(inputs);
    let expected = '[{"id":"ITEM0001","count":1},{"id":"ITEM0013","count":2},{"id":"ITEM0022","count":1}]';
    expect(JSON.stringify(format)).toEqual(expected);

  });

//2.生成商品详情
  it ('detail of items--buildItemwithDetail()',function(){
    let inputs = [{"id":"ITEM0001","count":1},{"id":"ITEM0013","count":2},{"id":"ITEM0022","count":1}];
    let itemdetail = buildItemwithDetail(inputs,loadAllItems());
    let expected = `[{"id":"ITEM0001","name":"黄焖鸡","price":"18.00","count":1,"subtotal":18},{"id":"ITEM0013","name":"肉夹馍","price":"6.00","count":2,"subtotal":12},{"id":"ITEM0022","name":"凉皮","price":"8.00","count":1,"subtotal":8}]`;
    expect(JSON.stringify(itemdetail)).toEqual(expected);

  });

//3.打折前的总价
  it ('total price of undiscount--unDiscountTotal()',function(){
    let inputs = [{"id":"ITEM0001","name":"黄焖鸡","price":"18.00","count":2,"subtotal":36},{"id":"ITEM0013","name":"肉夹馍","price":"6.00","count":2,"subtotal":12},{"id":"ITEM0022","name":"凉皮","price":"8.00","count":1,"subtotal":8}];
    let unDiscountTotalPrice = unDiscountTotal(inputs);
    let expected = 56;
    expect(unDiscountTotalPrice).toEqual(expected);

  });

//4.30-6优惠金额
  it ('30-6Save--ThirtyMinusSixSave()',function(){
    let inputs = 38;
    let ThirtyMinusSixSavePrice = ThirtyMinusSixSave(inputs);
    let expected = 6;
    expect(ThirtyMinusSixSavePrice).toEqual(expected);

  });

//5.获得当前购物车中的特价菜品
  it ('get current spceial items --getSpceialItems()',function(){
    let SpceialItems = getSpceialItems(loadPromotions());
    let expected = ['ITEM0001', 'ITEM0022']
    expect(SpceialItems).toEqual(expected);

  });

//6.特价菜品半价优惠金额
  it ('get spceial items save--SpceialItemSave()',function(){
    let ItemDetails = [{"id":"ITEM0001","name":"黄焖鸡","price":"18.00","count":1,"subtotal":18},{"id":"ITEM0013","name":"肉夹馍","price":"6.00","count":2,"subtotal":12},{"id":"ITEM0022","name":"凉皮","price":"8.00","count":1,"subtotal":8}];
    let SpceialItems = ['ITEM0001', 'ITEM0022']
    let SpceialItemSavePrice = SpceialItemSave(SpceialItems,ItemDetails);
    let expected = [{name:"黄焖鸡",spceialtemsave:9},{name:"凉皮",spceialtemsave:4}];
    expect(SpceialItemSavePrice).toEqual(expected);

  });

//7.选择优惠方案,0是没有优惠、1是满30-6、2是特价菜品
  it ('slect promotion project--selectPromotionProject()',function(){
    let currentSpceialItems =  13;
    let ThirtyMinusSixSave = 6;
    let flag = selectPromotionProject(currentSpceialItems,ThirtyMinusSixSave)
    let expected = 2;
    expect(flag).toEqual(expected);

  });

//8.计算总价
  it ('cal total price--CalTotalItem()',function(){
    let flag = 2;
    let unDiscountTotal = 38;
    let ThirtyMinusSixSave = 6;
    let SpceialItemSave = 13;
    let totalPrice = CalTotalItem(flag,unDiscountTotal,ThirtyMinusSixSave,SpceialItemSave)
    let expected = 25;
    expect(totalPrice).toEqual(expected);

  });

  it ('formartted list --formarttedList()',function(){
    let ItemDetails = [{"id":"ITEM0001","name":"黄焖鸡","price":"18.00","count":1,"subtotal":18},{"id":"ITEM0013","name":"肉夹馍","price":"6.00","count":2,"subtotal":12},{"id":"ITEM0022","name":"凉皮","price":"8.00","count":1,"subtotal":8}];
    let PromotionProject = 2;
    let ThirtyMinusSixSave = 6;
    let SpceialItemSave = [{name:"黄焖鸡",spceialtemsave:9},{name:"凉皮",spceialtemsave:4}];
    let spceialItemsavetotal = 13;
    let totalPrice = 25;

    let str = formarttedList(ItemDetails,ThirtyMinusSixSave,SpceialItemSave,spceialItemsavetotal,PromotionProject,totalPrice);
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim();

    expect(str.trim()).toEqual(expected);

  });

  


  it('should generate best charge when best is 指定菜品半价', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function() {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function() {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

});