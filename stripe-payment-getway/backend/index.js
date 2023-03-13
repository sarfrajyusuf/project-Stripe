const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(
  "sk_test_51Ml6EiSIGLTIJ4tsQimTN4EIIPA2Sm732IxtyI71REp0SEef7ayIWPMwHU6Lqv0no5RzjjLK0dJVxIwviFIIhBJU00kxQkwmKc"
);
const uuid = require("uuid").v4;

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("IT WORKS MY WEBSITE");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);
  console.log("price", product.price);

  const idempontencyKey = uuid();
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          //amount
          amount: product.price * 100,
          //currency
          currency: "usd",
          //customer
          customer: customer.id,
          //recepit
          receipt_email: token.email,
          //description
          description: `purchase of description.name`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    });
});

app.listen(8282, () => {
  console.log("server is running ");
});
