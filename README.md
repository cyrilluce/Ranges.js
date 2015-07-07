JavaScript区间计算库
JavaScript ranges calculate library

## 用法/Usage

可参照test/test.js中的测试代码

Refer to test code in `test/test.js`

## 示例/Sample

标准用法/Standard usage
```js
var Ranges = require('Ranges');
var ranges = new Ranges(1,10);
ranges.add([21, 30]); // ranges.ranges = [ [1,10], [21,30] ]
ranges.isConflict([11, 20]); // false
ranges.isConflict([25, 45]); // true
ranges.add([11, 20]); // ranges.ranges = [ [1,30] ]
ranges.sub([1,5]); // ranges.ranges = [ [6,30] ]
ranges.sub([15,25]); // ranges.ranges = [ [6,14], [26,30] ]
```

用于IPv4冲突判断/Use as IPv4 conflict detect
```js
var ipToNumber = function(dot){
    var d = dot.split('.');
    return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
};
var ranges = new Ranges(ipToNumber('192.168.1.100'), ipToNumber('192.168.1.199'));
ranges.isConflict([ipToNumber('192.168.0.1'), ipToNumber('192.168.2.1')]); // true
ranges.isContain(ipToNumber('192.168.1.125')); // true
```

用于IPv6冲突判断（字串对比）Use as IPv6 conflict detect(string range)
```js
function expand(address)
{
    var fullAddress = "";
    var expandedAddress = "";
    var validGroupCount = 8;
    var validGroupSize = 4;
    if(address.indexOf("::") == -1) // All eight groups are present.
        fullAddress = address;
    else // Consecutive groups of zeroes have been collapsed with "::".
    {
        var sides = address.split("::");
        var groupsPresent = 0;
        for(var i=0; i<sides.length; i++)
        {
            groupsPresent += sides[i].split(":").length;
        }
        fullAddress += sides[0] + ":";
        for(var i=0; i<validGroupCount-groupsPresent; i++)
        {
            fullAddress += "0000:";
        }
        fullAddress += sides[1];
    }
    var groups = fullAddress.split(":");
    for(var i=0; i<validGroupCount; i++)
    {
        while(groups[i].length < validGroupSize)
        {
            groups[i] = "0" + groups[i];
        }
        expandedAddress += (i!=validGroupCount-1) ? groups[i] + ":" : groups[i];
    }
    return expandedAddress;
}

var ranges = new Ranges(expand('fe80::1:fdd7:b312:1'), expand('fe80::bc5e:fdd7:b312:cd02'));
ranges.isConflict([expand('fe80::1'), expand('fe80::1de6:fa0a:892d:bf77')]); // true
ranges.isContain(expand('fe80::1de6:fa0a:892d:bf77')); // true
```

其它曾使用到的场景 Also used to solves these problems

使用html高亮搜索关键词 use html to highlight keywords

this is `test`est word

this is tes`test` word

this is `testest` word

## License

MIT