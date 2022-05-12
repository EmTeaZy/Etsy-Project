import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import InputLabel from "@mui/material/InputLabel";

import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import baseUrl from "../constants/baseUrl";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 4,
};

const theme = createTheme();

export default function EditShopFormPopup({ isOpen, setOpen, shop }) {
  const [name, setName] = useState(shop.name);
  useEffect(() => {
    setName(shop.name);
  }, [shop]);
  const handleClose = () => setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formData = new FormData();
    formData.append("name", data.get("shopName"));
    const img = document.getElementById("shopImg").files[0];
    formData.append("_id", shop._id);
    if (img) {
      formData.append("img", img);
    } else {
      formData.append("img", shop.img);
    }
    
    axios({
      method: "post",
      url: baseUrl + "/shop/update",
      withCredentials: true,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.isSuccess) {
          toast.success("Shop Updated successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignShops: "center",
                }}
              >
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid shop xs={12}>
                    <InputLabel id="demo-simple-select-label">
                      Shop Image
                    </InputLabel>
                    <div
                      className="shopImageUpload"
                      style={{ marginBottom: "1rem" }}
                    >
                      <input type="file" id="shopImg" />
                    </div>
                  </Grid>
                  <Grid container>
                    <Grid shop xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="shopName"
                        label="Shop Name"
                        name="shopName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Update Shop
                  </Button>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </Box>
      </Modal>
    </div>
  );
}
