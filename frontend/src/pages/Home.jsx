import React from 'react'
import AccessibilityMap from '../components/AccessibilityMap'
import SOSButton from '../components/SOSButton'


export default function Home(){
return (
<div className="space-y-6">
<div className="flex justify-between items-center">
<h2 className="text-2xl font-bold">Accessible Places Map</h2>
<SOSButton />
</div>


<AccessibilityMap />
</div>
)
}