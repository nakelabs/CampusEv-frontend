const awsConfig = {
    Auth: {
        Cognito: {
            userPoolId: 'af-south-1_I1cHl9FqG',
            userPoolClientId: '43ufcemati8n301rv79rm2s9vk',
            loginWith: {
                email: true,
            },
        }
    }
};

export default awsConfig;
