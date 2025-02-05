import ProgressBar from '@/components/ProgressBar'
import { ChartBarIcon, ScaleIcon, FireIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Today's Progress</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ScaleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-gray-900">Protein</h2>
          </div>
          <ProgressBar value={0} max={180} className="mt-4" />
          <p className="mt-2 text-sm text-gray-600">0g / 180g</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-gray-900">Carbs</h2>
          </div>
          <ProgressBar value={0} max={225} className="mt-4" />
          <p className="mt-2 text-sm text-gray-600">0g / 225g</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FireIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-gray-900">Fat</h2>
          </div>
          <ProgressBar value={0} max={60} className="mt-4" />
          <p className="mt-2 text-sm text-gray-600">0g / 60g</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900">Recent Meals</h2>
        <div className="mt-4">
          <p className="text-gray-600">No meals logged today</p>
        </div>
      </div>
    </div>
  )
}
