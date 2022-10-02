// require packages used in the project
const express = require("express")

// require express-handlebars here
const exphbs = require('express-handlebars')
const restaurantsData = require("./restaurant.json").results
const app = express()
const port = 3000


// setting template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(express.static("public"))

// routes setting
app.get("/", (req, res) => {
  res.render("index", { restaurantsData })
})

app.get("/search", (req, res) => {
  //設定條件，避免找不到符合關鍵字時下方頁面空白
  if (!req.query.keywords) {
    return res.redirect("/")
  }

  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()
  //優化使用者體驗，大小寫都搜尋得到
  const filterRestaurantsData = restaurantsData.filter(
    data =>
      data.name.toLowerCase().includes(keyword) ||
      data.category.includes(keyword)
    //設定關鍵字與餐廳類別，優化搜尋引擎找到特定餐廳
  )

  res.render("index", { restaurantsData: filterRestaurantsData, keywords })
})
app.get("/restaurants/:restaurantId", (req, res) => {
  const filterRestaurantsData = restaurantsData.filter(
    data => data.id === Number(req.params.restaurantId)
    // 字串轉數字
  )
  res.render("show", { restaurantData: filterRestaurantsData[0] })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
