// Imports
const {
  EC2Client,
  AuthorizeSecurityGroupIngressCommand,
  CreateKeyPairCommand,
  CreateSecurityGroupCommand,
  RunInstancesCommand
} = require("@aws-sdk/client-ec2");
const helpers = require('./helpers')

const client = new EC2Client({ region: "ap-southeast-2" });

// Declare local variables
const sgName = 'hamster_sg'
const keyName = 'hamster_key'

// Do all the things together
async function execute () {
  try {
    // await createSecurityGroup(sgName)
    // const keyPair = await createKeyPair(keyName)
    // await helpers.persistKeyPair(keyPair)
    const data = await createInstance(sgName, keyName)
    console.log('Created instance with:', data)
  } catch (err) {
    console.error('Failed to create instance with:', err)
  }
}

// Create functions
async function createSecurityGroup (sgName) {
  const createParams = {
    Description: sgName,
    GroupName: sgName
  };
  const data = await client.send(new CreateSecurityGroupCommand(createParams));

  const rulesParams = {
    GroupId: data.GroupId,
    IpPermissions: [
      {
        IpProtocol: "tcp",
        FromPort: 22,
        ToPort: 22,
        IpRanges: [{ CidrIp: "0.0.0.0/0" }]
      },
      {
        IpProtocol: "tcp",
        FromPort: 4200,
        ToPort: 4200,
        IpRanges: [{ CidrIp: "0.0.0.0/0" }]
      }
    ]
  };
  return client.send(new AuthorizeSecurityGroupIngressCommand(rulesParams));
}

async function createKeyPair (keyName) {
  const params = {
    KeyName: keyName
  };
  return client.send(new CreateKeyPairCommand(params));
}

async function createInstance (sgName, keyName) {
  const params = {
    ImageId: "ami-0882a8317eac96b37",
    InstanceType: "t2.micro",
    KeyName: keyName,
    MaxCount: 1,
    MinCount: 1,
    SecurityGroups: [sgName],
    UserData: "IyEvYmluL2Jhc2gKc3VkbyBhcHQtZ2V0IHVwZGF0ZQpzdWRvIGFwdC1nZXQgLXkgaW5zdGFsbCBnaXQKcm0gLXJmIC9ob21lL2JpdG5hbWkvTXlBcHBsaWNhdGlvbgpnaXQgY2xvbmUgaHR0cHM6Ly9naXRodWIuY29tL2phY2tjYmF0ZXMvbXlhcHBsaWNhdGlvbi5naXQgL2hvbWUvYml0bmFtaS9teWFwcGxpY2F0aW9uCmNob3duIC1SIGJpdG5hbWk6IC9ob21lL2JpdG5hbWkvbXlhcHBsaWNhdGlvbgpjZCAvaG9tZS9iaXRuYW1pL215YXBwbGljYXRpb24Kc3VkbyBucG0gY2kKc3VkbyBucG0gcnVuIGxpdGU="
  };
  return client.send(new RunInstancesCommand(params));
}

execute();
