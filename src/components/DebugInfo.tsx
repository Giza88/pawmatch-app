import React from 'react'

const DebugInfo: React.FC = () => {
  const [debugData, setDebugData] = React.useState<any>(null)

  React.useEffect(() => {
    const onboardingData = localStorage.getItem('pawfect-match-onboarding')
    const userProfile = localStorage.getItem('userProfile')
    const dogConnections = localStorage.getItem('dogConnections')

    setDebugData({
      onboardingData: onboardingData ? JSON.parse(onboardingData) : null,
      userProfile: userProfile ? JSON.parse(userProfile) : null,
      dogConnections: dogConnections ? JSON.parse(dogConnections) : null
    })
  }, [])

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid black', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h4>Debug Info:</h4>
      <div>
        <strong>Onboarding Data:</strong>
        <pre>{JSON.stringify(debugData?.onboardingData, null, 2)}</pre>
      </div>
      <div>
        <strong>User Profile:</strong>
        <pre>{JSON.stringify(debugData?.userProfile, null, 2)}</pre>
      </div>
      <div>
        <strong>Dog Connections:</strong>
        <pre>{JSON.stringify(debugData?.dogConnections, null, 2)}</pre>
      </div>
    </div>
  )
}

export default DebugInfo
