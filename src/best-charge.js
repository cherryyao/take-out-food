const {loadAllItems} = require('../src/items');
const {loadPromotions} = require('../src/promotions');

function bestCharge(selectedItems) {
  
  const formarttedItems = buildFormattedItem(selectedItems);
  const ItemDetails = buildItemwithDetail(formarttedItems,loadAllItems());
  const unDiscountTotalPrice = unDiscountTotal(ItemDetails);
  const ThirtyMinusSixSavePrice = ThirtyMinusSixSave(unDiscountTotalPrice);
  const SpceialItems = getSpceialItems(loadPromotions());



}

//1.格式化菜品
function buildFormattedItem(inputs){
let tempArray=[];
let formarttedItems=[];
for(let item of inputs){
   tempArray = item.split("x");
   formarttedItems.push({
     id:tempArray[0].trim(),
     count:parseFloat(tempArray[1])
   });
}
console.info(formarttedItems);
return formarttedItems;
}


//2.生成商品详情
function buildItemwithDetail(formarttedItems,AllItems){
   let ItemDetails=[];
   for(let formarttedItem of formarttedItems)
   {
     for(let item of AllItems){
      if(formarttedItem.id === item.id){
        ItemDetails.push({
          id:formarttedItem.id,
          name:item.name,
          price: item.price.toFixed(2),
          count:formarttedItem.count,
          subtotal:item.price*formarttedItem.count
        });
      }
     }
   }
   console.info(ItemDetails);
   return ItemDetails;
}

//3.打折前的总价
function unDiscountTotal(ItemDetails){
  let unDiscountTotalPrice = 0;
  for(let item of ItemDetails){
    unDiscountTotalPrice += item.subtotal;
  }
  console.info(unDiscountTotalPrice)
  return unDiscountTotalPrice;
}

//4.30-6优惠金额
function ThirtyMinusSixSave(unDiscountTotalPrice){
  let ThirtyMinusSixSave = 0;
  if(unDiscountTotalPrice>30){
    ThirtyMinusSixSave = parseInt(unDiscountTotalPrice/30)*6;
  }
  // console.info(ThirtyMinusSixSave);
  return ThirtyMinusSixSave;
}

//5.获得特价菜品
function getSpceialItems(loadPromotions){
  let SpceialItems =[];
  for(let promotions of loadPromotions)
  {
    if(promotions.type==="指定菜品半价")
    {
      for(let promotionsItem of promotions.items)
      {
        SpceialItems.push(promotionsItem);
      }
    }
  }
  console.info(SpceialItems);
  return SpceialItems;
}


module.exports = {
  buildFormattedItem,
  buildItemwithDetail,
  unDiscountTotal,
  ThirtyMinusSixSave,
  getSpceialItems
}