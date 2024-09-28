import { registerRootComponent } from 'expo'
import { View, Text } from 'react-native'
import POCAPP from './index'

function App() {
  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <POCAPP />
    </View>
  )
}

registerRootComponent(App)
