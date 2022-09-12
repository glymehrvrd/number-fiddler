function addSeperator(num) {
  return {
    title: Number(num).toLocaleString(),
    description: "加上分位符",
  };
}

function numberToChinese(num) {
  // convert number to chinese
  // > numberToChinese(0)
  // 零
  // > numberToChinese(1)
  // 一
  // > numberToChinese(10)
  // 一十
  // > numberToChinese(11)
  // 一十一
  // > numberToChinese(100)
  // 一百
  // > numberToChinese(1000)
  // 一千
  // > numberToChinese(10000)
  // 一万
  // > numberToChinese(100000)
  // 一十万
  // > numberToChinese(100000)
  // 一百万
  // > numberToChinese(1000000)
  // 一千万
  // > numberToChinese(10000000)
  // 一千万
  // > numberToChinese(100000000)
  // 一亿
  // > numberToChinese(100000100)
  // 一亿零一百
  if (isNaN(num)) {
    return "请先输入数字";
  }
  if (num === 0) {
    return "零";
  }
  if (num < 0) {
    return "负" + numberToChinese(-num);
  }
  const digitalToChinese = (digital) => {
    const arr = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    if (!(digital >= 0 && digital <= 9)) {
      throw new Error("digital overflowed");
    }
    return arr[digital];
  };
  const getUnit = (i) => {
    if (i < 0) {
      throw new Error("unit underflowed");
    }
    if (i == 0) {
      return "";
    } else if (i === 1) {
      return "万";
    } else if (i == 2) {
      return "亿";
    } else {
      return getUnit(i - 2) + "亿";
    }
  };
  if (num >= 10 && num <= 19) {
    return "十" + (num === 10 ? "" : digitalToChinese(num % 10));
  }
  let result = "";
  let hasNonZero = false;
  let needZero = false;
  const sectionToChinese = (num) => {
    const arr = ["千", "百", "十", ""];
    if (!(num >= 0) && num <= 9999) {
      throw new Error("section overflowed");
    }
    let mask = 1000;
    for (let i = 0; i < 4; i++) {
      digital = Math.floor(num / mask);
      num = num % mask;
      mask = mask / 10;
      if (digital === 0 && hasNonZero) {
        needZero = true;
        continue;
      }
      if (digital != 0) {
        if (needZero) {
          result = result + "零";
          needZero = false;
        }
        result = result + digitalToChinese(digital) + arr[i];
        hasNonZero = true;
      }
    }
    return needZero;
  };
  const getSections = (num, sections) => {
    if (num <= 9999) {
      sections.push(num);
    } else {
      getSections(Math.floor(num / 10000), sections);
      sections.push(num % 10000);
    }
  };
  const sections = [];
  getSections(num, sections);
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    sectionToChinese(section);
    if (section !== 0) {
      result = result + getUnit(sections.length - i - 1);
    }
  }
  return result;
}

function addNum2CN(num) {
  return {
    title: numberToChinese(Number(num)),
    description: "数字转中文",
  };
}

window.exports = {
  numify: {
    // 注意：键对应的是 plugin.json 中的 features.code
    mode: "list", // 列表模式
    args: {
      // 进入插件时调用（可选）
      enter: (action, callbackSetList) => {
        return callbackSetList([
          addSeperator(action.payload),
          addNum2CN(action.payload),
        ]);
      },
      // 子输入框内容变化时被调用 可选 (未设置则无搜索)
      search: (action, searchWord, callbackSetList) => {
        return callbackSetList([
          addSeperator(searchWord),
          addNum2CN(searchWord),
        ]);
      },
      // 用户选择列表中某个条目时被调用
      select: (action, itemData, callbackSetList) => {
        utools.copyText(itemData.title);
        utools.hideMainWindow();
      },
      // 子输入框为空时的占位符，默认为字符串"搜索"
      placeholder: "输入数字",
    },
  },
};
