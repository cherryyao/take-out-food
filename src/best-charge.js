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
  }else{
    ThirtyMinusSixSave=0;
  }
  // console.info(ThirtyMinusSixSave);
  return ThirtyMinusSixSave;
}

//5.获得当前购物车中的特价菜品
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

//6.特价菜品半价优惠金额
function SpceialItemSave(SpceialItems,ItemDetails){
 
  let currentSpceialItems=[];
  for(let item of ItemDetails){
    //console.info(item);
    for(let spceialItem of SpceialItems){
      let currentSpceialItemsSave= 0;
      if(spceialItem == item.id){
        currentSpceialItemsSave = (item.price/2)*item.count;   
        currentSpceialItems.push({
          name:item.name,
          spceialtemsave:currentSpceialItemsSave
        });   
      }
    }
  }
  console.info(currentSpceialItems);
  return currentSpceialItems;
}

//7.选择优惠方案,0是没有优惠、1是满30-6、2是特价菜品
function selectPromotionProject(currentSpceialItems,ThirtyMinusSixSave){
  let flag=0;
  let spceialItemsavetotal = 0;
  for(let save of currentSpceialItems){
    spceialItemsavetotal +=save.spceialtemsave;
  }

  if(spceialItemsavetotal > 0 && ThirtyMinusSixSave > 0 ){
    if(spceialItemsavetotal <= ThirtyMinusSixSave){
      flag =1;
    }
    else {
      flag = 2;
    }
  }else{
    flag=0;
  }
  return flag;
}


module.exports = {
  buildFormattedItem,
  buildItemwithDetail,
  unDiscountTotal,
  ThirtyMinusSixSave,
  getSpceialItems,
  SpceialItemSave,
  selectPromotionProject
}