### 食物分类

#### 获取食物分类

**地址**：

```
/foodClass/getClass
```

**方式**：GET

**参数**: 无

**返回值示例**：

```javascript
{
    "list": [
        {
            "code": "1",
            "name": "谷类及制品",
            "sn": 1,
            "color": "#b28a29",
            "posi": "10px 10px"
        }
    ]
}
```





### 食物信息

#### 获取食物列表

**地址**：

```
/food/getList
```

**方式**：GET

**参数**: 

| 编码       | 必传 | 类型 | 示例              | 解释                 |
| ---------- | ---- | ----------------- | -------------------- | -------------------- |
| sortCol    | 是   | String | code              | 排序列               |
| direction  | 是   | Int | 1/-1              | 升序或者降序         |
| lastValue  | 否   | Int | 10                | 列表最后一个项的编码 |
| classCode  | 否   | Int | 22                | 食物分类编码         |
| searchWord | 否   | String | 肉                | 搜索关键字           |
| elements   | 是   | Array | ["Edible","Water"] | 获取的元素编码数组   |

**返回值示例**：

```javascript
{
    "list": [
        {
            "code": 779,
            "classCode": "16",
            "className": "畜肉类及制品",
            "info": "猪",
            "name": "猪肉(肥瘦)(均值)",
            "alias": "",
            "englishName": "",
            "Edible": "100%",
            "Water": "46.8g",
            "Energy": "1634KJ",
        }
    ]
}
```

