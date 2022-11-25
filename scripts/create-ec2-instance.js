const {
  EC2Client
} = require("@aws-sdk/client-ec2");

const client = new EC2Client({ region: process.env.AWS_REGION });
