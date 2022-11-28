const {
  EC2Client,
  DescribeInstancesCommand,
  TerminateInstancesCommand
} = require("@aws-sdk/client-ec2");

const client = new EC2Client({ region: "ap-southeast-2" });

async function listInstances() {
  const data = await client.send(new DescribeInstancesCommand({}));
  return data.Reservations.reduce((i, r) => {
    return i.concat(r.Instances)
  }, []);
}

async function terminateInstance(instanceId) {
  const params = {
    InstanceIds: [instanceId]
  };
  return client.send(new TerminateInstancesCommand(params));
}

listInstances().then(console.log);
// terminateInstance('i-0b2cf3e529c64ca90');
