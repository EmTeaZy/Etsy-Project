import React, {useEffect, useState} from "react";
import "../css/pages/Favourites.css";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import baseUrl from "../constants/baseUrl";
import {toast} from "react-toastify";
import SingleItem from "../components/SingleItem";
import SearchIcon from "@mui/icons-material/Search";
import {alpha, styled} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const Search = styled("div")(({theme}) => ({
    position: "relative",
    marginTop: "20px",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}))
const SearchIconWrapper = styled("div")(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

function Favourites() {
    const [search, setSearch] = useState("")
    const [favourites, setFavourites] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    useEffect(() => {
        axios({
            method: "get",
            url: baseUrl + "/favourites/get",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                setIsLoading(false);
                if (response.data.isSuccess) {
                    setFavourites(response.data.favourites);
                    console.log("Favourites: ", response.data.favourites);
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }, []);

    useEffect(() => {
        axios({
            method: "get",
            url: baseUrl + "/auth/user",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Accept: "application/json",
            },
        }).then((response) => {
            if (response.data.isLogin) {
                setUser(response.data.user);
            } else {
                window.location.href = "/login";
            }
        });
    }, []);
    return (
        <div id="favourites">
            <header>
                <div className="user-info">
                    {user && user.avatar ? (
                        <img src={`${baseUrl}/profileImages/${user.avatar}`} alt="user"/>
                    ) : null}
                    <p>
                        <strong>{user?.fullName}</strong>
                    </p>
                    <button
                        onClick={() => {
                            window.location.href = "/edit-profile";
                        }}
                    >
                        <EditIcon color="inherit"/>
                    </button>
                </div>
            </header>

            <Search>
                <SearchIconWrapper>
                    <SearchIcon/>
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{"aria-label": "search"}}
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />
            </Search>

            <h1 style={{marginTop: "3rem"}}>Favourites Items</h1>

            <div className="favourites-items-container">
                { favourites && search !== "" ?
                    favourites.map((item) => {
                    if (item.name.includes(search))
                    return (
                    <SingleItem
                    item={item}
                    key={item._id}
                    liked={true}
                    favourites={favourites}
                    setFavourites={setFavourites}
                    />);
                    else
                    return null
                }) : favourites && search === "" ? favourites.map((item) => {
                    return (
                    <SingleItem
                    item={item}
                    key={item._id}
                    liked={true}
                    favourites={favourites}
                    setFavourites={setFavourites}
                    />
                    );
                }) : isLoading ?
                    "Loading..."
                    : "No Favourites"}
            </div>
        </div>
    );
}

export default Favourites;
