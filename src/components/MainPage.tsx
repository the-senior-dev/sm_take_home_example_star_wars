import React, { useState, useEffect } from 'react'
import styled from "styled-components"

import { Movie, FullApiResponse, ResponseStatus } from '../types'
import MovieList from './MovieList'
import Pagination from './Pagination'
import { buildListUrl } from "../utils/api"

import loadable from "@loadable/component";

const Loading = () => (<h1>Loading</h1>)

const LoadablePagination = loadable(() => import("./Pagination"), {
    fallback: <Loading />
});

export default function MainPage() {
    const [movieList, setMovieList] = useState<Movie[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageTotal, setPageTotal] = useState(1)
    const [searchText, setSearchText] = useState("Star Wars")
    const [error, setError] = useState("");


    async function getMovies() {
        const url = buildListUrl(searchText, currentPage)
        const response = await fetch(url)

        if (response.status === 200) {
            const data = await response.json() as FullApiResponse;
            if (data.Response === ResponseStatus.True) {
                setMovieList(data.Search)
                const pageTotalCalc = Math.ceil(parseInt(data.totalResults) / 10);
                setPageTotal(pageTotalCalc)
            } else {
                setError(data.Error)
            }
        } else {
            // handle network error
            setError("Network Error")
        }

    }

    useEffect(() => {
        getMovies()
    }, [currentPage]) // when current page changes, on did mount

    return (
        <MainContainer>
            <Content>
                <SearchContainer>
                    <SearchInput placeholder="star wars" value={searchText} onChange={(event) => (setSearchText(event.target.value))}></SearchInput>
                    <Button onClick={() => (getMovies())}>Search</Button>
                </SearchContainer>
                <MovieList movieList={movieList} />
                <LoadablePagination pageTotal={pageTotal} currentPage={currentPage} setCurrentPage={setCurrentPage}></LoadablePagination>
            </Content>

        </MainContainer>
    )
}


const SearchContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`

const SearchInput = styled.input`
    width: 60%;
    height: 30px;
    padding-top: 0px;
    padding-left: 4px;
    padding-bottom: 0px;
    border-width: 1px;
    margin-top: 0px;
    margin-bottom: 0px;
    color: #34495e;
    :focus-visible{
        border-radius: 0px;
        border-color: #2980b9;
        outline: none;
    }
`

const Content = styled.div`
  max-width: 860px;
  margin-top: 4rem;
  width: 100%;
`


const MainContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Button = styled.button`
  box-sizing: content-box;
  display: inline-block;
  border-width: 0px;
  border-color: #34ace0;
  height: 30px;  
  border-radius: 1px;
  margin: 0rem 1rem;
  width: 11rem;
  background: #34ace0;
  color: white;
  margin-left: 0px;
  margin-right: 0px;
  font-weight: 400;
  :hover{
    background: #227093;
    cursor: pointer;
  }
`