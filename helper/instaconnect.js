"use Strict";

require("dotenv").config();
// const { IgApiClient } = require("instagram-private-api");
const quoteBuffer = require("../schemas/quoteBufferSchema");
const axios = require("axios");
const { quotes } = require("./quotesAPI");
const { randomHashtag } = require("./hashtags");
const sharp = require("sharp");
const fs = require("fs");

exports.igImageUpload = async () => {
  var res = {};
  try {
    var quote;
    var quoteRes = await quotes();
    quote = quoteRes.quote[0];
    var quoteToInsta = quote.quote + "\n-" + quote.author;
    const text = quoteToInsta;
    var caption =
      "Your views about this Post..?\n.\nThe comment section is yours!!\n.\nI post QUOTES daily\n.\n.\n.\nfollow\n@wisequotient\n@wisequotient\n@wisequotient\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#wisequotient ";
    var captionWithHashTag = caption + randomHashtag();
    //-----------------------------------------------------------------------
    const quoteToImgURL = "https://web-series-quotes-api.deta.dev/pic/custom";
    const imageResponse = await axios.get(
      `${quoteToImgURL}?text=${text}&background_color="white"&text_color="black"&text_size=50&x=1080&y=1080`,
      { responseType: "arraybuffer" }
    );
    const imageBuffer = await sharp(imageResponse.data)
      .resize(800) // Resize the image to a maximum width of 800 pixels
      .jpeg({ quality: 80 }) // Convert the image to JPEG format with a quality of 80%
      .toBuffer();

    var res = await this.instaClientBufferToDB(imageBuffer, captionWithHashTag);
    // const outputDir = "./output";
    // const outputFileName = "output.jpg";
    // const outputPath = `${outputDir}/${outputFileName}`;

    // if (!fs.existsSync(outputDir)) {
    //   fs.mkdirSync(outputDir);
    // }

    // fs.writeFile(outputPath, imageBuffer, (err) => {
    //   if (err) throw err;
    //   console.log("The image was saved!");
    // });
    // res = {
    //   code: 200,
    //   status: "Success",
    //   message: "Publishing initialized",
    // };
  } catch (error) {
    res = {
      code: 403,
      status: "Failure",
      message: `Something went wrong!\nerror: ${error}`,
    };
  }
  return res;
};

exports.instaClientBufferToDB = async (imageBuffer, captionWithHashTag) => {
  const quoteAndImgBuffer = new quoteBuffer({
    caption: captionWithHashTag,
    quoteBuffer: imageBuffer,
  });
  await quoteAndImgBuffer
    .save()
    .then(async () => {
      res = {
        code: 200,
        status: "Success",
        message: "Success!",
      };
      // await this.sendEmail(email);
    })
    .catch((e) => {
      res = {
        code: 201,
        status: "Failure",
        message:
          "Oh oh!! we are facing issue with database. Please try again after sometime..\nSorry for the inconvenience!",
      };
    });
  return res;
};
