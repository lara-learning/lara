import { ACMClient, RequestCertificateCommand } from '@aws-sdk/client-acm'

exports.handler = async (event: {
  ResourceProperties: {
    Region: string
    DomainName: string
  }
}) => {
  const region = event.ResourceProperties.Region
  const domainName = event.ResourceProperties.DomainName

  const acmClient = new ACMClient({ region: region })

  try {
    const command = new RequestCertificateCommand({
      DomainName: domainName,
      ValidationMethod: 'DNS',
      DomainValidationOptions: [
        {
          DomainName: domainName,
          ValidationDomain: domainName,
        },
      ],
    })

    const certResponse = await acmClient.send(command)

    const certificateArn = certResponse.CertificateArn

    return {
      Status: 'SUCCESS',
      PhysicalResourceId: certificateArn,
      Data: {
        CertificateArn: certificateArn,
      },
    }
  } catch (error) {
    console.log('Error requesting certificate:', error)
    return {
      Status: 'FAILED',
      Reason: (error as Error).message,
    }
  }
}
