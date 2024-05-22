import React, { useEffect, useState } from 'react'
import NavBarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavbar, WrapperProducts, WrapperTypeProduct } from './style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import TypeProduct from '../../components/TypeProduct/TypeProduct'

const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [typeProducts, setTypeProducts] = useState([])
    const { state } = useLocation()
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    })
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 })
    const [filters, setFilters] = useState({
        form: [],
        author: [],
        supplier: []
    })

    const fetchProductType = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductType(type, page, limit)
        if (res?.status === 'OK') {
            setLoading(false)
            setProducts(res?.data)
            setPanigate({ ...panigate, total: res?.totalPage })
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page, panigate.limit)
        }
    }, [state, panigate.page, panigate.limit])

    useEffect(() => {
        const filtered = products.filter(product => 
            product.price >= priceRange.min && product.price <= priceRange.max &&
            (filters.form.length === 0 || filters.form.includes(product.form)) &&
            (filters.author.length === 0 || filters.author.includes(product.author)) &&
            (filters.supplier.length === 0 || filters.supplier.includes(product.supplier))
        )
        setFilteredProducts(filtered)
    }, [products, priceRange, filters])

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    const onChange = (current, pageSize) => {
        setPanigate({ ...panigate, page: current - 1, limit: pageSize })
    }

    const handlePriceChange = (min, max) => {
        setPriceRange({ min, max })
    }

    const handleFilterChange = (filters) => {
        setFilters(filters)
    }

    const distinctForms = [...new Set(products.map(product => product.form))]
    const distinctAuthors = [...new Set(products.map(product => product.author))]
    const distinctSuppliers = [...new Set(products.map(product => product.supplier))]

    return (
        <Loading isLoading={loading}>
            <div style={{ width: 'auto', margin: '0 auto', background: '#d4d4d4' }}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => {
                        return (
                            <TypeProduct name={item} key={item} />
                        )
                    })}
                </WrapperTypeProduct>
            </div>
            <div style={{ width: '100%', background: '#efefef', height: 'calc(100vh - 64px)' }}>
                <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height: 'calc(100% - 20px)' }}>
                        <WrapperNavbar span={4}>
                            <NavBarComponent 
                                onPriceChange={handlePriceChange} 
                                onFilterChange={handleFilterChange} 
                                forms={distinctForms}
                                authors={distinctAuthors}
                                suppliers={distinctSuppliers}
                            />
                        </WrapperNavbar>
                        <Col span={20} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <WrapperProducts>
                                {filteredProducts?.filter((pro) => {
                                    if (searchDebounce === '') {
                                        return pro
                                    } else if (pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                                        return pro
                                    }
                                })?.map((product) => {
                                    return (
                                        <CardComponent
                                            key={product._id}
                                            countInStock={product.countInStock}
                                            description={product.description}
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            rating={product.rating}
                                            type={product.type}
                                            selled={product.selled}
                                            discount={product.discount}
                                            id={product._id}
                                        />
                                    )
                                })}
                            </WrapperProducts>
                            <Pagination defaultCurrent={panigate.page + 1} total={panigate?.total} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    )
}

export default TypeProductPage
