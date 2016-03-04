/**
 * Created by lizhiyao on 2016/3/4.
 */

$(function () {
    //构建学生对象模型
    var Student = Backbone.Model.extend({
        validate: function (attrData) {
            for (var attr in attrData) {
                if (attrData[attr] == '') {
                    return attr + "不能为空！";
                }
                if (attr == 'Score' && isNaN(attrData.Score)) {
                    return "分数必须为数字";
                }
            }
        }
    });

    //构建基于学生模型的集合
    var StudentList = Backbone.Collection.extend({
        model: Student
    });

    //实例化一个集合对象
    var Students = new StudentList();

    //构建用于模板的视图
    var StudentView = Backbone.View.extend({
        tagName: 'li',
        className: 'li_c',
        template: _.template($('#item-template').html()),
        events: {
            "dblclick span": "editing",
            "blur input,select": "blur",
            "click span a": "dele"
        },
        editing: function (e) {
            $(e.currentTarget).removeClass("show")
                .addClass("editing").find("input, select").focus();
        },
        blur: function (e) {
            var $currentEle = $(e.currentTarget);
            var objData = {};
            objData[$currentEle.attr('name')] = $currentEle.val();
            this.model.set(objData, {'validate': true});
            $(e.currentTarget).parent().removeClass("editing").addClass("show");
        },
        dele: function () {
            this.model.destroy();
        },
        initialize: function () {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },
        render: function () {
            $(this.el).html(this.template(this.model.toJSON()));
            this.setValue();
            return this;
        },
        remove: function () {
            $(this.el).remove();
        },
        setValue: function () {
            var model = this.model;
            $(this.el).find('input, select').each(function () {
                var $currentEle = $(this);
                $currentEle.val(model.get($currentEle.attr('name')));
            });
        }
    });

    //构建主页视图
    var stuAppView = Backbone.View.extend({
        el: $('#stuManager'),
        events: {
            "click #btnAdd": "newStudent"
        },
        newStudent: function (e) {
            console.log('newStudent');
            var stu = new Student();
            var objData = {};
            $("#Name, #Sex, #Score").each(function () {
                objData[$(this).attr('name')] = $(this).val();
            });
            console.log(objData);
            stu.bind('invalid', function (model, error) {
                $("#pStatus").show().html(error);
            });
            if (stu.set(objData, { 'validate': true })) {
                console.log(12121212)
                Students.add(stu);
                $("#pStatus").hide();
            }
        },
        initialize: function () {
            Students.bind('add', this.addData, this);
            $("#StuID").val(Students.length + 1);
        },
        addData: function (stu) {
            console.log(stu)
            stu.set({
                "StuID": stu.get("StuID") || Students.length
            });
            console.log(stu)
            var stuView = new StudentView({ model: stu });
            console.log(stuView)
            console.log(stuView.render())
            console.log(stuView.render().el)
            $("#ulMessage").append(stuView.render().el);
            $("#Name, #Score").each(function () {
                $(this).val("");
            });
            $("#StuID").val(Students.length + 1);
        }
    });

    //实例化一个主页视图对象
    var stuAppView = new stuAppView();
});