const express = require("express");
const router = express.Router();
const constant = require("../utils/constants");
const API_URL = require("../utils/query");
var nodemailer = require("nodemailer");

// DELETE from group WHERE groupId='GR517'
module.exports = router;
var Transport = nodemailer.createTransport("SMTP", {
  service: "gmail",
  auth: {
    user: "riftsettler@gmail.com",
    pass: "1ve17cs082",
  },
});

///----------------createGroup--------------------------//
router.post("/createGroup", function (req, res) {
  try {
    //console.log(req.body);
    req.getConnection(function (error, conn) {
      conn.query(
        API_URL.getQuery(
          ["*"],
          "group",
          "groupName=" + "'" + req.body.groupName + "'"
        ),
        function (error, result) {
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
          }
          console.log(result);
          var groupId = "GR" + Math.floor(Math.random() * 1000);
          if (result.length > 0) {
            res
              .status(constant.HTML_STATUS_CODE.SUCCESS)
              .json("data already exit");
          } else {
            let userId = req.body.userId;
            conn.query(
              API_URL.postQuery("group", [
                "'" + req.body.groupName + "'",
                "'" + groupId + "'",
                "'" + req.body.description + "'",
                "'" + userId + "'",
                "'" +
                  "[" +
                  JSON.stringify({ userId: req.body.userId }) +
                  "]" +
                  "'",
              ]),
              function (error, reslt) {
                if (error) {
                  res
                    .status(
                      error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR
                    )
                    .json(error);
                } else {
                  res.send({ message: "new group created" + req.body.name });
                  console.log("group created");
                }
              }
            );
          }
        }
      );
    }); // getCOnnection close
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});

///----------------invite member--------------------------//
router.post("/invite", function (req, res) {
  try {
    let groupId = req.body.groupId;

    var mailOptions = {
      from: "riftsettler@gmail.com",
      to: req.body.email,
      subject: "CODE",
      text: "code",
      html: `<br><p style="color:blue;">This is the groupId for joining group ${req.body.groupName} .<h1 style="color:orange;">${req.body.groupId}</h1> </p>`,
    };
    setTimeout(function () {
      Transport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
          res.send("error");
        } else {
          console.log("Message sent: " + response.message);
        }
      });
    });
    res.send("sent");

    // });// getCOnnection close
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});

///----------------join member--------------------------//////
router.post("/join", function (req, res) {
  try {
    req.getConnection(function (err, conn) {
      conn.query(
        API_URL.getQuery(["*"], "", "groupId=" + "'" + req.body.groupId + "'"),
        function (error, result) {
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
          }

          if (result.length == 0) {
            res
              .status(constant.HTML_STATUS_CODE.SUCCESS)
              .json("enter valid groupId ");
          } else {
            conn.query(
              `UPDATE group
                SET member = IF(
                                    JSON_TYPE(member) <=> 'ARRAY',
                                    member,
                                    JSON_ARRAY()
                                  ),
                    member = JSON_ARRAY_APPEND(
                                  member,
                                  '$',
                                  CAST('{"userId":"${req.body.userId}"}' AS JSON)
                                )
                WHERE groupId = '${req.body.groupId}'`,

              function (error, result) {
                if (error) {
                  res
                    .status(
                      error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR
                    )
                    .json(error);
                } else {
                  res.send({ message: "new group created" + req.body.name });
                  console.log("group created");
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});

//------------------***add expenses--------------------//
router.post("/addExpences", function (req, res) {
  var today = new Date();
  var expId = Math.floor(Math.random() * 1000000);
  console.log(today);
  try {
    req.getConnection(function (err, conn) {
      console.log(req.body.description);
      conn.query(
        API_URL.postQuery("group_expences", [
          "'" + req.body.groupId + "'",
          "'" + req.body.userId + "'",
          "'" + today + "'",
          "'" + req.body.description + "'",
          "'" + req.body.amount + "'",
          "true",
          "'" + req.body.name + "'",
          "'" + expId + "'",
        ]),
        function (error, result) {
          console.log(result);
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
            console.log(error);
          } else {
            res
              .status(constant.HTML_STATUS_CODE.SUCCESS)
              .json("Data Stored Successfully");
            console.log("posted sucessfully");
          }
        }
      );
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});

//------------------***GET--------------------//
router.get("/getGroupExp/:groupId", function (req, res) {
  try {
    req.getConnection(function (err, conn) {
      conn.query(
        `SELECT * FROM group_expences where groupId='${req.params.groupId}' AND status=1`,
        function (error, result) {
          //console.log(result);
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
            console.log(error);
          } else {
            res.jsonp({ status: "sent", message: " data sent ", data: result });
          }
        }
      );
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});

//------------------***GET grouplist --------------------//
router.get("/getGroupList/:userId", function (req, res) {
  try {
    req.getConnection(function (err, conn) {
      conn.query(
        `SELECT * FROM group WHERE JSON_CONTAINS(member, JSON_OBJECT('userId','${req.params.userId}'))`,
        function (error, result) {
          // console.log(result);
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
            console.log(error);
          } else {
            res.jsonp({ status: "sent", message: " data sent ", data: result });
          }
        }
      );
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});

//------------------***totalMyAmount--------------------//
router.post("/totalMyExpenses", function (req, res) {
  try {
    req.getConnection(function (err, conn) {
      conn.query(
        `SELECT * FROM group_expences where  groupId='${req.body.groupId}' AND status=1 AND userId='${req.body.userId}'`,
        function (error, result) {
          console.log(result);
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
            console.log(error);
          } else {
            res.jsonp({ status: "sent", message: " data sent ", data: result });
          }
        }
      );
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});

//------------------settleUp --------------------//
router.get("/getGroupExp/:groupId", function (req, res) {
  try {
    req.getConnection(function (err, conn) {
      conn.query(
        `SELECT * FROM group_expences where groupId='${req.params.groupId}' AND status=1`,
        function (error, result) {
          console.log(result);
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
            console.log(error);
          } else {
            res.jsonp({ status: "sent", message: " data sent ", data: result });
          }
        }
      );
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});

router.get("/delete/:groupId", function (req, res) {
  try {
    req.getConnection(function (err, conn) {
      conn.query(
        `DELETE from group WHERE groupId='${req.params.groupId}'`,
        function (error, result) {
          console.log(result);
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
            console.log(error);
          } else {
            res.jsonp({ status: "sent", message: " data sent ", data: result });
          }
        }
      );
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});

///----------------store--------------------------//
router.post("/store", function (req, res) {
  try {
    console.log(req.body);
    req.getConnection(function (error, conn) {
      conn.query(
        API_URL.postQuery("settle", [
          "'" + req.body.date + "'",
          "'" + req.body.groupId + "'",
          "'" + req.body.totalExp + "'",
          "'" + JSON.stringify(req.body.userDetail) + "'",
        ]),
        function (error, reslt) {
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
          } else {
            conn.query(
              `UPDATE group_expences set status=0  WHERE groupId='${req.body.groupId}' `,
              function (error, result) {
                console.log(result[0]);
                if (error) {
                  res
                    .status(
                      error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR
                    )
                    .json(error);
                  console.log(error);
                } else {
                  res.jsonp({
                    status: "sent",
                    message: " data sent ",
                    data: result,
                  });
                }
              }
            );
            //res.send({'message':'new group created'+req.body.name});
            console.log("data stored");
          }
        }
      );

      //});
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});

router.get("/deleteExp/:groupId", function (req, res) {
  try {
    req.getConnection(function (err, conn) {
      console.log(req.body.description);
      conn.query(
        `UPDATE group_expences set status=0  WHERE groupId='${req.params.groupId}' `,
        function (error, result) {
          console.log(result[0]);
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
            console.log(error);
          } else {
            res.jsonp({ status: "sent", message: " data sent ", data: result });
          }
        }
      );
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});
/*-----------------------------------settleDetails-------------------------------------------------------*/
router.get("/settleDetail/:groupId", function (req, res) {
  try {
    req.getConnection(function (err, conn) {
      console.log(req.body.description);
      conn.query(
        `SELECT * FROM settle WHERE groupId='${req.params.groupId}' `,
        function (error, result) {
          console.log(result);
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
            console.log(error);
          } else {
            res.jsonp({ status: "sent", message: " data sent ", data: result });
          }
        }
      );
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});

/*-----------------------------------deleteSettleDetails-------------------------------------------------------*/
router.get("/deleteSettleDetail/:groupId", function (req, res) {
  try {
    req.getConnection(function (err, conn) {
      console.log(req.body.description);
      conn.query(
        `DELETE FROM settle WHERE groupId='${req.params.groupId}' `,
        function (error, result) {
          console.log(result);
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
            console.log(error);
          } else {
            res.jsonp({ status: "sent", message: " data sent ", data: result });
          }
        }
      );
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});
//------------------deletePExp--------------------//
router.get("/deletePExp/:expId", function (req, res) {
  try {
    req.getConnection(function (err, conn) {
      console.log(req.body.description);
      conn.query(
        `delete from group_expences where expId='${req.params.expId}'`,
        function (error, result) {
          //console.log(result[0]);
          if (error) {
            res
              .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
              .json(error);
            console.log(error);
          } else {
            res.jsonp({
              status: "delete",
              message: " expDelete ",
              data: result,
            });
          }
        }
      );
    });
  } catch (error) {
    res
      .status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR)
      .json(error);
  }
});
