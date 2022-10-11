import React, { FC, useState } from 'react'
import ReactEcharts from 'echarts-for-react'

interface Props {
  option: object
  style?: object
}

const MyEcharts: FC<Props> = ({ option = {}, style = {} }) => {
  const [theme, setTheme] = useState(
    window.localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
  )
  const themeColor = { theme }
  const options = {
    ...option,
    grid: {
      left: '8%',
      right: '8%',
      top: '6%',
      bottom: '8%'
    }
  }
  return <ReactEcharts option={options} {...themeColor} style={style} />
}

export default MyEcharts
