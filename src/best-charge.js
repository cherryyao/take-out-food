const {loadAllItems} = require('../src/items');
const {loadPromotions} = require('../src/promotions');

function bestCharge(selectedItems) {
  
  const formarttedItems = buildFormattedItem(selectedItems);
  const ItemDetails = buildItemwithDetail(formarttedItems,loadAllItems());
  const unDiscountTotalPrice = unDiscountTotal(ItemDetails);
  const ThirtyMinusSixSavePrice = ThirtyMinusSixSave(unDiscountTotalPrice);
  const SpceialItems = getSpceialItems(loadPromotions());
  const currentSpceialItems=SpceialItemSave(SpceialItems,ItemDetails);
  const spceialItemsavetotal = spceialItemsavetotalPrice(currentSpceialItems);
  const flag = selectPromotionProject(spceialItemsavetotal,ThirtyMinusSixSavePrice);
  const totalPrice = CalTotalItem(flag,unDiscountTotalPrice,ThirtyMinusSixSavePrice,spceialItemsavetotal);
  const str = formarttedList(ItemDetails,ThirtyMinusSixSavePrice,currentSpceialItems,spceialItemsavetotal,flag,totalPrice);
  return str;
  //const str = formarttedList();
  
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
//console.info(formarttedItems);
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
   //console.info(ItemDetails);
   return ItemDetails;
}

//3.打折前的总价
function unDiscountTotal(ItemDetails){
  let unDiscountTotalPrice = 0;

  for(let item of ItemDetails){
    unDiscountTotalPrice += item.subtotal;
  }
  //console.info(unDiscountTotalPrice)
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
   console.info("30-6优惠价钱:"+ThirtyMinusSixSave);
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
    //console.info(SpceialItems);
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
  //console.info(currentSpceialItems);
  return currentSpceialItems;
}

function spceialItemsavetotalPrice(currentSpceialItems){
  let spceialItemsavetotal = 0;
  for(let save of currentSpceialItems){
    spceialItemsavetotal +=save.spceialtemsave;
  }
  console.info("半价优惠的金额:"+spceialItemsavetotal);
  return spceialItemsavetotal;
}

//7.选择优惠方案,0是没有优惠、1是满30-6、2是特价菜品
function selectPromotionProject(spceialItemsavetotal,ThirtyMinusSixSave){
  let flag=0;
  if(spceialItemsavetotal === ThirtyMinusSixSave){
    flag=1;
    if(spceialItemsavetotal === 0){
      flag = 0;
    }
  }else if(spceialItemsavetotal < ThirtyMinusSixSave){
    flag = 1;
  }else {
    flag = 2;
  }

  console.info("选择方案:"+flag);
  return flag;
}

//8.计算总价
function CalTotalItem(flag,unDiscountTotal,ThirtyMinusSixSave,SpceialItemSave){
  let totalPrice;
  if(flag===0){
    totalPrice=unDiscountTotal;
  }
  if(flag === 1)  {
    totalPrice = unDiscountTotal-ThirtyMinusSixSave;
  }
  if(flag === 2){
    totalPrice = unDiscountTotal-SpceialItemSave;
  }
  //console.info(totalPrice);
  return totalPrice;
}

//9.格式化清单
function formarttedList(ItemDetails,ThirtyMinusSixSave,SpceialItemSave,spceialItemsavetotal,PromotionProject,totalPrice){
  
  
  str  = `\n============= 订餐明细 =============\n`
  ItemDetails.map(item=>{
    str += `${item.name} x ${item.count} = ${item.subtotal}元\n`;
  });
  // 黄焖鸡 x 1 = 18元
  // 肉夹馍 x 2 = 12元
  // 凉皮 x 1 = 8元
  if(PromotionProject!=0){
    str += `-----------------------------------\n`;
    str += `使用优惠:\n`;
    if(PromotionProject === 1 ){
      str += `满30减6元，省${ThirtyMinusSixSave}元\n`;
    }
    if(PromotionProject === 2 ){
      str += `指定菜品半价`;
      SpceialItemSave.map((item,index)=>{
        if(index === 0){
          str += `(${item.name}`;
        }else{
          str += `，${item.name}`;
        }       
      }); 
      str += `)，省${spceialItemsavetotal}元\n`
    } 
  }
  // -----------------------------------
  // 使用优惠:
  // 指定菜品半价(黄焖鸡，凉皮)，省13元
  str += `-----------------------------------\n`;
  str += `总计：${totalPrice}元\n`;
  str += `===================================`;
  // -----------------------------------
  // 总计：25元
  // ===================================`
  console.info(str);
  return str
}


module.exports = {
  buildFormattedItem,
  buildItemwithDetail,
  unDiscountTotal,
  ThirtyMinusSixSave,
  getSpceialItems,
  SpceialItemSave,
  selectPromotionProject,
  CalTotalItem,
  formarttedList,
  bestCharge
}