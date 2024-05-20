import React, { useState } from 'react'
import { Slider, InputNumber, Select } from 'antd'
import { WrapperContent, WrapperLableText } from './style'

const { Option } = Select

const formatNumber = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const NavBarComponent = ({ onPriceChange, onFilterChange, forms, authors, suppliers }) => {
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(1000000)
    const [form, setForm] = useState([])
    const [author, setAuthor] = useState([])
    const [supplier, setSupplier] = useState([])

    const handleSliderChange = (value) => {
        const [min, max] = value
        setMinPrice(min)
        setMaxPrice(max)
        onPriceChange(min, max)
    }

    const handleFormChange = (value) => {
        setForm(value)
        onFilterChange({ form: value, author, supplier })
    }

    const handleAuthorChange = (value) => {
        setAuthor(value)
        onFilterChange({ form, author: value, supplier })
    }

    const handleSupplierChange = (value) => {
        setSupplier(value)
        onFilterChange({ form, author, supplier: value })
    }

    return (
        <div>
            <WrapperLableText>Tìm kiếm</WrapperLableText>
            <WrapperContent>
                <Slider
                    range
                    min={0}
                    max={1000000}
                    step={10000}
                    defaultValue={[minPrice, maxPrice]}
                    onChange={handleSliderChange}
                    value={[minPrice, maxPrice]}
                    tipFormatter={(value) => `${formatNumber(value)} VND`}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <InputNumber
                        min={0}
                        max={1000000}
                        value={minPrice}
                        onChange={(value) => handleSliderChange([value, maxPrice])}
                        formatter={value => `${formatNumber(value)}`}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        style={{ marginRight: '10px' }}
                    />
                    <InputNumber
                        min={0}
                        max={1000000}
                        value={maxPrice}
                        onChange={(value) => handleSliderChange([minPrice, value])}
                        formatter={value => `${formatNumber(value)}`}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </div>

                <Select
                    mode="multiple"
                    placeholder="Hình thức"
                    style={{ width: '100%', marginBottom: '10px' }}
                    onChange={handleFormChange}
                    value={form}
                >
                    {forms.map(form => (
                        <Option key={form} value={form}>{form}</Option>
                    ))}
                </Select>

                <Select
                    mode="multiple"
                    placeholder="Tác giả"
                    style={{ width: '100%', marginBottom: '10px' }}
                    onChange={handleAuthorChange}
                    value={author}
                >
                    {authors.map(author => (
                        <Option key={author} value={author}>{author}</Option>
                    ))}
                </Select>

                <Select
                    mode="multiple"
                    placeholder="Nhà xuất bản"
                    style={{ width: '100%', marginBottom: '10px' }}
                    onChange={handleSupplierChange}
                    value={supplier}
                >
                    {suppliers.map(supplier => (
                        <Option key={supplier} value={supplier}>{supplier}</Option>
                    ))}
                </Select>
            </WrapperContent>
        </div>
    )
}

export default NavBarComponent
