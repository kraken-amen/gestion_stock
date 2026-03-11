import { useParams } from "react-router-dom"

const RegionPage = () => {
  const { name } = useParams()

  return (
    <div>
      <h1>Region: {name}</h1>
    </div>
  )
}

export default RegionPage