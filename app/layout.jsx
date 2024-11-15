import { AppBody, RootHtml } from '@/packages/provider'
import { ThemeProvider } from '@/packages/themes'

import '@/packages/asset/style/global.scss'
import '@radix-ui/themes/styles.css'

const RootLayout = ({ children }) => {
  return (
    <RootHtml>
      <AppBody>
        <ThemeProvider>{children}</ThemeProvider>
      </AppBody>
    </RootHtml>
  )
}

export default RootLayout
