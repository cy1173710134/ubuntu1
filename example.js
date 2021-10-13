/*
//常用JS代码参考
*/

//常用引入外部JS

document.write('<script type="text/javascript" src="../../CustomJsLib/EFGPShareMethod.js"></script>');//for 开窗

document.write('<script type="text/javascript" src="../../dwrDefault/interface/ajax_CommonAccessor.js"></script>');//ajax调用

//全局变量定义和颜色
var gDate14 = document.getElementById("Date14_txt");//申请日期
var gsqrid = document.getElementById("sqrid");//申请人代号
var gsqr = document.getElementById("sqr");//申请人名称
var gsqbmid = document.getElementById("sqbmid");//申请部门代号
var gsqbm = document.getElementById("sqbm");//申请部门名称

var number = document.getElementById("number").toFixed(2);//转换成2位小数
// 红色：ffcccc
// 黑色：000000
// 灰色：cccccc


//数据库链接
var databaseCfgId_EFGP = "EFGP";   //系統管理員資料來源(DataAccessDefinition)代號
var tDbConn_EFGP = new DataSource("ccsqd", "SQLEFGP");//表單名;SQL name
//
document.getElementById("txtContractNo").innerHTML//获取表单单号
function formCreate() {
    DefalInfo();
    return true;
}

function formOpen() {

    var tGrid1 = document.getElementById("Grid1").value; //取出儲存在隱藏欄位中的Grid資料
    if (typeof (Grid1Obj) != "undefined") {  //判斷grid物件是否存在表單中

        if (tGrid1.length > 1) {  //判斷Grid是否有資料
            Grid1Obj.reload(eval(tGrid1));  //若Grid有資料則將存於隱藏中的值載入Grid中
        }
    }
    return true;
}

function formSave() {
    if (typeof (Grid1Obj) != "undefined") {  //判斷grid物件是否存在表單中
        document.getElementById("Grid1").value = Grid1Obj.toArrayString();  //將Grid裡的資料儲存至隱藏欄位中
    }

    return true;
}

function formClose() {
    return true;
}

//单选开窗
function btnsqr_onclick() {

    var FileName = "SingleOpenWin";
    var sql = " select U.id,U.userName,OU.id,OU.organizationUnitName " +
        " from Users U left join Functions F on F.occupantOID = U.OID " +
        " left join OrganizationUnit OU on OU.OID = F.organizationUnitOID " +
        " inner join Organization O on O.OID = OU.organizationOID " +
        " where U.leaveDate is null and F.isMain = 1 and OU.organizationUnitType = 0 ";
    var SQLClaused = new Array(sql);
    var SQLLabel = new Array("申请人代号", "申请人姓名", "部门代号", "部门名称");//客制开窗的Grid Label
    var QBEField = new Array("U.id", "U.userName",);//模糊查询,須和DB Table栏位名称相同
    var QBELabel = new Array("申请人代号", "申请人姓名");//模糊查询的Label
    var ReturnId = new Array("apa21", "gen02", "apa22", "gem02");//表单上的栏位代号
    singleOpenWin(FileName, databaseCfgId_EFGP, SQLClaused, SQLLabel, QBEField, QBELabel, ReturnId, 720, 430);

}

//开窗关闭后触发的事件
function checkPointOnClose(pReturnId) {

    if (pReturnId == "apa21")   //根据申请人ID获取送货厂商默认编号
    {
        //获取申请人所在组织
        var tSql = " select u.username,fl.levelvalue,ou.organizationunitname,og.organizationname,og.id,og.organizationname from Users U " +
            " inner Join Functions F on F.occupantOID=U.OID " +
            " inner Join OrganizationUnit OU ON OU.OID=F.organizationUnitOID " +
            " inner Join FunctionDefinition FD ON FD.OID=F.definitionOID " +

            " inner join functionlevel Fl on fl.oid =F.Approvalleveloid " +
            " inner join organization og on og.oid =ou.organizationoid " +
            " where u.id = '" + gapa21.value + "'";
        //	alert(tSql);
        var results = tDbConn_EFGP.query(tSql);
        if (results.length > 0) {
            ghidsqrzzid.value = results[0][5];
        }
    }

}

//表单预设值
function DefalInfo() {
    gDate14.value = systemDateTime;//申请日期
    document.getElementById("sqrid").value = userId;//申请人ID
    document.getElementById("sqr").value = userName;//申请人姓名
    document.getElementById("sqbmid").value = mainOrgUnitIds;//申请部门ID
    document.getElementById("sqbm").value = mainOrgUnitNames;//申请部门
    document.getElementById("sqrid").value = "300";//申请人ID
}

//Grid新增
function btn_add_onclick() {
    Grid1Obj.addRow();  //將Binding欄位的資料填入Grid中

    Grid1Obj.clearBinding();  //新增後清除Binding欄位資料
    document.getElementById("Grid1").value = Grid1Obj.toArrayString();  //將新的資料存入Grid隱藏欄位中

}

//Grid修改
function btn_edit_onclick() {
    Grid1Obj.editRow();  //將修改後的欄位的資料填入Grid中

    Grid1Obj.clearBinding();  //清除Binding欄位資料
    document.getElementById("Grid1").value = Grid1Obj.toArrayString();  //將新的資料存入Grid隱藏欄位中

}

//Grid删除
function btn_delete_onclick() {
    Grid1Obj.deleteRow();  //將Grid某筆資料刪除
    Grid1Obj.clearBinding();  //清除Binding欄位資料
    document.getElementById("Grid1").value = Grid1Obj.toArrayString();  //將新的資料存入Grid隱藏欄位中

}

//判断不能为空
// ------------判断不能为空方式一----------
function formSave() {
    return checkNull();
    return true;

}

//检查不能为空
function checkNull() {
    if (activityId == "ACT7") {
        var tMsg = "";
        var tErrMsg = "不能为空";
        if (Textbox50.value == "") {
            tMsg = tMsg + "请支原因" + tErrMsg + " \r\n";
        }
        if (Textbox52.value == "") {
            tMsg = tMsg + "在途金额" + tErrMsg + " \r\n";
        }
        if (tMsg == "") {
            return true;
        } else {
            alert(tMsg);
            return false;
        }
    } else {
        return true;//第一关以外的关卡
    }
}

// ------------判断不能为空方式二,Grid不能为空----------
//表单保存
function formSave() {
    //非空校验合格
    if (checkNull()) {
        if (typeof (Grid1Obj) != "undefined") {  //判斷grid物件是否存在表單中
            document.getElementById("Grid1").value = Grid1Obj.toArrayString();  //將Grid裡的資料儲存至隱藏欄位中
        }
        //判斷Grid是否有資料
        if (document.getElementById("Grid1").value == "[]") {
            alert("单身不能为空，请按新增按钮将单头资料插入单身中！");
            return false;
        }
        return true;
    }
    return false;

}


//金额必须是数字
function Textbox25_onblur() {
    var str = document.getElementById("Textbox25").value;
    if (!isNaN(str) || str == ".") {
        document.getElementById("Textbox27").value = DX(document.getElementById("Textbox25").value);
        return true;
    } else {
        alert("金额必须是数字");
        document.getElementById("Textbox25").focus();
    }
}

//金额转大写
function DX(n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
        return "";
    var unit = "千百拾亿千百拾万千百拾元角分", str = "";
    n += "00";
    var p = n.indexOf('.');
    if (p >= 0)
        n = n.substring(0, p) + n.substr(p + 1, 2);
    unit = unit.substr(unit.length - n.length);
    for (var i = 0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
}

//单价*数量=总价
function SubTotal() {
    if (tTxtQuantity.value != "" && tTxtPrice.value != "") {
        tTxtSubTotal.value = parseFloat(tTxtQuantity.value) * parseFloat(tTxtPrice.value);
    } else {
        tTxtSubTotal.value = '0';
    }
}

//计算Grid中的金额合计
function GridTotal() {

    var gridData = g1Obj.getData();
    var tSellingPriceTemp = 0;

    if (gridData.length > 0) {
        for (i = 0; i < gridData.length; i++) {
            if (gridData[i][5] != "") {
                tSellingPriceTemp = tSellingPriceTemp + eval(gridData[i][5]);
            }
        }
        tTxtTotalPrice.value = eval(tSellingPriceTemp);
    } else {
        tTxtTotalPrice.value = '0';
    }
}


//根据申请人带出相应部门ID，可应用在根据申请人ID带出相应职务、直属主管等信息
function iptUser_onchange() {
    if (iptUser_txt.value.length > 0) {
        var tSql = " select U.id,U.userName,OU.id,OU.organizationUnitName" +
            " from Users U left join Functions F on F.occupantOID = U.OID " +
            " left join OrganizationUnit OU on OU.OID = F.organizationUnitOID " +
            " inner join Organization O on O.OID = OU.organizationOID " +
            " where U.leaveDate is null and F.isMain = 1 and OU.organizationUnitType = 0 and U.id = '" + iptUser_txt.value + "' ";
        var tResult = tDbConn.query(tSql);

        if (tResult.length > 0) {
            tTxtDeptId.value = tResult[0][2];
            tTxtDeptName.value = tResult[0][3];
        } else {
            alert("请购人不存在 !!");//出差人不存在 !!
        }
    } else {
        tTxtDeptId.value = '';
        tTxtDeptName.value = '';
    }
}

//下拉框的内外储值
function Dd_sksjd_onclick() {
    var obj = document.getElementById("Dd_sksjd");//获取select控件，Select1为控件Select的id
    var index = obj.selectedIndex;//选中的索引；
    var text = obj.options[index].text;//选中的文本，外显值
    var Value = obj.options[index].value;//选中值，内储值
    document.getElementById("hdnType1").value = text;
}

//checkbox判断或赋值，一个等号是赋值 两个等号是判断
document.getElementById("Ckb_dqxq_0").checked == true;//栏位是否被选中
document.getElementById("Ckb_sqzbly_0").checked = false;//栏位被清空

document.getElementById("Textbox8").style.display = "none";//不显示对象
document.getElementById("Textbox8").style.display = "";//显示对象（采用默认值）
document.getElementById("Tb_lzryid").readOnly = true;//栏位只读
document.getElementById("btn_lzry").disabled = true; //栏位不可编辑
document.getElementById("CW_CJKJE").style.backgroundColor = "yellow";//设置背景颜色
document.getElementById("CW_CJKJE").style.color = "transparent"//设置字体颜色为透明
if (CW_CJKJE_onchange() == false) {
    return false;
}//判断方法是否被使用


//根据申请人找一直往上找直属主管的直属主管...
var result = "";

function formCreate() {
    find();
    Man.value = result;
    return true;
}


function find() {
    for (var i = 0; i < 5; i++, j++) {
        var j = 0;
        if (j != 0) {
            j++;
        }
        var tSql = " select U.id,U.username from Users U where U.OID in (select F.specifiedManagerOID " +
            " from Users U ,Functions F  where F.occupantOID = U.OID and U.id ='" + Id.value + "')";
        var tResult = tDbConn.query(tSql);
        if (tResult[0][0] == 'ZH001317') {
            return false;
        } else {
            if (tResult.length > 0) {
                result = result + tResult[0][0] + "_" + tResult[0][1] + ";";
                Id.value = tResult[0][0];
            }

        }

    }
    alert(result);
}

// ===============================打印相关==================================
//     1. 系统标准列印，如何隐藏系统标准的’签核意见:’ 标签和’签核意见’的Grid？
// 答：
//此段放formopen里，即可
if (formMode == "isPrintForm") {
    document.getElementById("Comment_shell").style.display = "none";
    document.getElementById("Comment_lable").style.display = "none";

    //    2、若在表单中需要调用写好的JSP界面，需在表单中添加一个button事件。双引号部分为存放JSP的服务器路径。
    // 具体方法如下：
    function btn_Print_onclick() {
        window.open("/NaNaWeb/CustomOpenWin/TS_pxfybg.jsp");
    }

// ==============================5761行动版设计画面============================
//     function formOpen() {
//         //顯示輸入畫面上元件
//         <GridID>Obj.setShowGridElements(["<ElementID_1>","<ElementID_2>","..."]);
//             {/*// 隱藏輸入畫面上元件*/}
//             <GridID>Obj.setHiddenGridElements(["<ElementID_1>","<ElementID_2>","..."]);
//                 return true;
//                 }
//
//                 {/*=============5761以上-E10行动表单Grid隐藏主键ID的代码=======================*/}
//
//                 {/*==========维护不合格单==========*/}
//                 function formOpen(){
//                     var tHiddenGirdTestColumn = [1,2];
//                     hiddenAppGridColumn("PO_CHANGE_D", tHiddenGirdTestColumn);
//                     return true;
//                 }
//
//                 {/*========维护请购单========*/}
//                 function formOpen(){
//                     var tHiddenGirdTestColumn = [0,3,6,15,18,23,24,25,26,28,29,30,31,37,40,43,47];
//                     hiddenAppGridColumn("REQUISITION_D", tHiddenGirdTestColumn);
//                     hiddenAppGridColumn("REQUISITION_D", tHiddenGirdTestColumn);
//                     return true;
//                 }
//
//                 {/*========维护采购订单========*/}
//                 function formOpen(){
//
//                     var tHiddenGirdTestColumn = [0,3,7,15,19,23,33,42,46,53,56,65,66];
//                     hiddenAppGridColumn("PURCHASE_ORDER_D", tHiddenGirdTestColumn);
//                     return true;
//                 }
//
//                 {/*=====维护采购订单变更单========*/}
//
//                 function formOpen(){
//                     var tHiddenGirdTestColumn = [0,3,6,10,18,22,30,41,45,51,55];
//                     hiddenAppGridColumn("PO_CHANGE_D", tHiddenGirdTestColumn);
//                     return true;
//                 }
//
//                 {/*=====维护销售订单========*/}
//
//                 function formOpen(){
//                     var tHiddenGirdTestColumn = [0,26,46,48,54,63,67,70];
//                     hiddenAppGridColumn("SALES_ORDER_DOC_D", tHiddenGirdTestColumn);
//                     hiddenAppGridColumn("SALES_ORDER_DOC_D", tHiddenGirdTestColumn);
//                     return true;
//                 }
//
//                 {/*维护销售订单变更单*/}
//
//                 function formOpen(){
//                     var tHiddenGirdTestColumn = [0,14,16,18,26,27,47,48,49,64,65,69,70,71,72];
//                     hiddenAppGridColumn("SALES_ORDER_DOC_D", tHiddenGirdTestColumn);
//                     return true;
//                 }



