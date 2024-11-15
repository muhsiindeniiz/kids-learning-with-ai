const validateEnv = () => {
  const requiredEnvs = {
    NEXT_PUBLIC_DEPLOY_ENV: ['production', 'development'],
    NEXT_PUBLIC_DEPLOY_URL: '',
    MONGO_DB_URL: '',
    OPENAI_API_KEY: '',
    ELEVEN_LABS_API_KEY: '',
  }

  if (process.env.NODE_ENV === 'development') {
    for (const [key, validValues] of Object.entries(requiredEnvs)) {
      const value = process.env[key]

      if (!value) {
        console.warn(`Warning: Missing environment variable: ${key}`)
      }

      if (Array.isArray(validValues) && value && !validValues.includes(value)) {
        console.warn(
          `Warning: Invalid value for ${key}. Must be one of: ${validValues.join(', ')}`
        )
      }
    }
  }
}

validateEnv()

export const env = {
  deployEnv: process.env.NEXT_PUBLIC_DEPLOY_ENV || 'development',
  deployUrl: process.env.NEXT_PUBLIC_DEPLOY_URL || 'http://localhost:3000',
  mongoDBUrl: process.env.MONGO_DB_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
  elevenLabsApiKey: process.env.ELEVEN_LABS_API_KEY,
}

// Default export
export default env
