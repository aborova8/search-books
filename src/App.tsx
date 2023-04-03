import React, { useCallback, useEffect, useState } from "react";
import {
  InputBase,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import listOfBooksData from "./data/listofbooks.json";
import { ListOfBooksType } from "./types/ListOfBooksType";
import "./App.scss";

function App() {
  const [searchText, setSearchText] = useState<string>("");
  const [sortType, setSortType] = useState<string>("author");
  const [displayList, setDisplayList] = useState<boolean>(false);
  const [bookSearchData, setBookSearchData] = useState<
    (ListOfBooksType | null)[]
  >([]);

  const bookSearch = useCallback(
    (searchedString: string) => {
      const matchingBook: (ListOfBooksType | null)[] = listOfBooksData
        .map((book) => {
          if (
            book.author.toLowerCase().includes(searchedString.toLowerCase()) ||
            book.title.toLowerCase().includes(searchedString.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchedString.toLowerCase())
          ) {
            return book;
          }
          return null;
        })
        .filter((book) => book)
        .sort((a: any, b: any) => a[sortType].localeCompare(b[sortType]));

      setBookSearchData(matchingBook);
    },
    [sortType]
  );

  const searchMatch = (bookText: string) => {
    if (bookText?.toLowerCase().includes(searchText.toLowerCase())) {
      return bookText.replace(
        new RegExp(searchText.toLowerCase(), "gi"),
        (match) => `<span class="search-list__colored">${match}</span>`
      );
    }

    return bookText;
  };

  const searchMatchBold = (bookText: string | undefined) => {
    if (
      bookText?.toLowerCase().includes(searchText.toLowerCase()) &&
      searchText?.length
    ) {
      return "search-list__bold";
    }

    return "";
  };

  useEffect(() => {
    if (searchText?.length) {
      bookSearch(searchText);
    }
  }, [bookSearch, displayList, searchText, sortType]);

  return (
    <Box className="search">
      <Box className="search-header">
        <Typography variant="h3">Search for books</Typography>
      </Box>
      <Box className="search-sort">
        <Typography className="search-sort__title" variant="body1">
          Sorting alphabetically by
        </Typography>
        <FormControl>
          <InputLabel id="search-sort-label">Sort</InputLabel>
          <Select
            labelId="search-sort-label"
            className="search-sort__select"
            value={sortType}
            label="Age"
            onChange={(e) => setSortType(e.target.value)}
          >
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="genre">Genre</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box className="search-form">
        <Box className="search-form__box">
          <InputBase
            className="search-form__box__input"
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <SearchIcon className="search-from__box__icon" />
        </Box>
        <Button
          sx={{ px: 2, py: 1 }}
          variant="contained"
          onClick={() => setDisplayList(true)}
        >
          Search
        </Button>
      </Box>
      <Box className="search-list">
        {displayList && (
          <List dense>
            {bookSearchData?.length ? (
              bookSearchData.map(
                (value: ListOfBooksType | null, index: number) => (
                  <ListItem key={index}>
                    <Box className="search-list__item">
                      <p
                        className={searchMatchBold(value?.author)}
                        dangerouslySetInnerHTML={{
                          __html: searchMatch(value?.author ?? ""),
                        }}
                      />
                      <p
                        className={searchMatchBold(value?.title)}
                        dangerouslySetInnerHTML={{
                          __html: searchMatch(value?.title ?? ""),
                        }}
                      />
                      <p
                        className={searchMatchBold(value?.genre)}
                        dangerouslySetInnerHTML={{
                          __html: searchMatch(value?.genre ?? ""),
                        }}
                      />
                    </Box>
                  </ListItem>
                )
              )
            ) : (
              <Typography variant="body2" sx={{ p: 1 }}>
                No results found
              </Typography>
            )}
          </List>
        )}
      </Box>
    </Box>
  );
}

export default App;
