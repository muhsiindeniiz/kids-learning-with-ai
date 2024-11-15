const validateEnv = () => {
  const requiredEnvs = {
    NEXT_PUBLIC_DEPLOY_ENV: ['production', 'development'],
    NEXT_PUBLIC_DEPLOY_URL: '',
    MONGO_DB_URL: '',
    OPENAI_API_KEY: '',
    ELEVEN_LABS_API_KEY: '',
  }

  for (const [key, validValues] of Object.entries(requiredEnvs)) {
    const value = process.env[key]

    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`)
    }

    if (Array.isArray(validValues) && !validValues.includes(value)) {
      throw new Error(
        `Invalid value for ${key}. Must be one of: ${validValues.join(', ')}`
      )
    }
  }
}

// Environment variables'ı doğrula ve export et
validateEnv()

export const env = {
  deployEnv: process.env.NEXT_PUBLIC_DEPLOY_ENV,
  deployUrl: process.env.NEXT_PUBLIC_DEPLOY_URL,
  mongoDBUrl: process.env.MONGO_DB_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
  elevenLabsApiKey: process.env.ELEVEN_LABS_API_KEY,
}
