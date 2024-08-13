import React, { useState, useEffect } from 'react'
import { View, Button, PickerView, PickerViewColumn } from '@tarojs/components'
import proList from './city'
import './index.less'
import { AddressProps, cityType, provinceType } from '../types/addressProps'

const AddressPicker: React.FC<AddressProps> = ({
  withCity,
  onPick,
  onAConfirm,
  address,
}) => {
  const [pos, setPos] = useState<number[]>([0, 0])

  useEffect(() => {
    if (address) {
      const picked = address.split('-') as [provinceType, cityType]
      const pickedProInfo = proList.find((pro) => pro.label === picked[0])
      const pickedCityInfo = pickedProInfo?.children.find(
        (city) => city.label === picked[1]
      )
      setPos([
        proList.indexOf(pickedProInfo),
        withCity && pickedCityInfo ? pickedProInfo.children.indexOf(pickedCityInfo) : 0,
      ])
    }
  }, [address, withCity])

  function onPickerChange(e) {
    const provinceIndex = e.detail.value[0]
    const cityIndex = e.detail.value[1] || 0
    const provinceName = proList[provinceIndex].label
    const cityName = proList[provinceIndex].children[cityIndex]?.label || ''
    
    setPos(withCity ? [provinceIndex, cityIndex] : [provinceIndex, -1])
    onPick && onPick(withCity ? `${provinceName}-${cityName}` : provinceName)
  }

  return (
    <>
      <View className="address-hover" onClick={onAConfirm}></View>
      <View id="Apicker-ad">
        <Button className="pConfirm" onClick={onAConfirm}>
          确定
        </Button>
        <PickerView
          className="toast"
          indicatorStyle="height: 50px;"
          style="width: 100%; height: 300px;"
          value={pos}
          onChange={onPickerChange}
        >
          <PickerViewColumn style={{ paddingLeft: 20, textAlign: 'center' }}>
            {proList.map((province, index) => (
              <View key={index}>{province.label}</View>
            ))}
          </PickerViewColumn>

          {withCity && (
            <PickerViewColumn>
              {proList[pos[0]].children.map((item, index) => (
                <View key={index}>{item.label}</View>
              ))}
            </PickerViewColumn>
          )}
        </PickerView>
      </View>
    </>
  )
}
export default AddressPicker
