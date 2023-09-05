import AWS from "aws-sdk";
import pulumi from "@pulumi/pulumi";
import dotenv from "dotenv";
dotenv.config();

// Initialize Pulumi and AWS SDK
const cloudfront = new AWS.CloudFront({ region: "us-west-2" });
process.env.AWS_ACCESS_KEY_ID = process.env.PULUMI_DEPLOYMENT_KEY;
process.env.AWS_SECRET_ACCESS_KEY = process.env.PULUMI_DEPLOYMENT_SECRET;

async function getStackOutputs(stackName, projectName) {
  const stack = await pulumi.automation.LocalWorkspace.selectStack({
    stackName,
    projectName,
    program: () => {},
  });
  return await stack.outputs();
}

(async () => {
  const outputs = await getStackOutputs(
    "justinemmanuelmercado/personal/dev",
    "dev"
  );
  const cdnDistributionId = outputs?.cdnDistributionId?.value;
  if (!cdnDistributionId) {
    console.error("Couldn't get CloudFront domain");
    return;
  }

  const params = {
    DistributionId: cdnDistributionId, // Get this from Pulumi output
    InvalidationBatch: {
      CallerReference: `${new Date().getTime()}`,
      Paths: {
        Quantity: 1,
        Items: ["/*"],
      },
    },
  };

  try {
    const data = await cloudfront.createInvalidation(params).promise();
    console.log("Invalidation succeeded:", data);
  } catch (err) {
    console.error("Invalidation failed:", err);
  }
})();
