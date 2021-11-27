const path = require('path')
const db = require('../db/index')

// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
    // TODO：表单数据合法，继续后面的处理流程...
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }
    const sql = `insert into ev_articles set ?`
    // 执行 SQL 语句
    db.query(sql, articleInfo, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('发布文章失败！')
        // 发布文章成功
        res.cc('发布文章成功', 0)
    })
}
exports.getArticle = (req, res) => {
    const sql = `select * from ev_articles`
    db.query(sql, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length === 0) return res.cc('获取文章分类数据失败！')
        // 把数据响应给客户端
        results.forEach(items => {
            delete items.content
            delete items.cover_img
            delete items.is_delete
            delete items.cate_id
            delete items.author_id
        })
        res.send({
            status: 0,
            message: '获取文章列表成功！',
            data: results,
            total: results.length
        })
    })
}