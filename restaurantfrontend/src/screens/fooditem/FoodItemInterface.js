import { useStyles } from "./FoodItemInterfaceCss";
import {
  Grid,
  TextField,
  Button,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Avatar,
  FormHelperText,
} from "@mui/material";
import Heading from "../../components/heading/Heading";
import { UploadFile } from "@mui/icons-material";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import { useState, useEffect } from "react";
import { getData, postData } from "../../services/FetchNodeServices";
import Swal from "sweetalert2";

export default function FoodItemInterface() {
  const classes = useStyles();
  var admin = JSON.parse(localStorage.getItem("ADMIN"));
  ///? useStates///////////////////////////
  const [restaurantId, setRestaurantId] = useState("");
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [foodItemName, setFoodItemName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [iconData, setIconData] = useState({ url: "", bytes: "" });
  const [resError, setResError] = useState({});

  const handleError = (error, input, message) => {
    setResError((prevState) => ({
      ...prevState,
      [input]: { error: error, message: message },
    }));
  };

  function validation() {
    let submitRecord = true;
    if (restaurantId.length === 0) {
      handleError(true, "restaurantId", "please Input Restaurant Id");
      submitRecord = false;
    }

    if (!categoryId) {
      handleError(true, "categoryId", "please select category");

      submitRecord = false;
    }

    if (foodItemName.trim().length === 0) {
      handleError(true, "foodItemName", "please Input food Item Name");
      submitRecord = false;
    }

    if (price.trim().length === 0) {
      handleError(true, "price", "please Input price");
      submitRecord = false;
    }
    if (offerPrice.trim().length === 0) {
      handleError(true, "offerPrice", "please Input offer price");
      submitRecord = false;
    }
    if (ingredients.trim().length === 0) {
      handleError(true, "ingredients", "please Input ingredients");
      submitRecord = false;
    }
    // if(!iconData.url)
    // {
    //   handleError(true,'fileFssai','Please Upload Fssai')

    //   submitRecord=false
    // }
    return submitRecord;
  }

  const fetchAllCategory = async () => {
    var result = await postData("category/fetch_all_category", {
      restaurantid: admin.restaurantid,
    });
    setCategory(result.data);
  };

  useEffect(function () {
    fetchAllCategory();
    setRestaurantId(admin.restaurantid);
  }, []);

  const fillCategory = () => {
    return category.map((item) => {
      return <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>;
    });
  };

  const handleIcon = (event) => {
    setIconData({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };

  const handleSubmit = async () => {
    if (validation()) {
      const formData = new FormData();
      formData.append("restaurantid", restaurantId);
      formData.append("categoryid", categoryId);
      formData.append("fooditemname", foodItemName);
      formData.append("foodtype", foodType);
      formData.append("ingredients", ingredients);
      formData.append("price", price);
      formData.append("offerprice", offerPrice);
      formData.append("icon", iconData.bytes);

      const result = await postData("fooditem/fooditem_submit", formData);

      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Food Item Registration",
          text: result.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message,
        });
      }
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Heading
              title={"Register Food Item"}
              myroute={"/admindashboard/displayallfooditem"}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              value={restaurantId}
              disabled
              label={"Restaurant Id"}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Category Name</InputLabel>
              <Select
                label={"Category Name"}
                onFocus={() => handleError(false, "restaurantId", "")}
                error={resError?.categoryId?.error}
                onChange={(event) => setCategoryId(event.target.value)}
                value={categoryId}
              >
                <MenuItem>-Select Category-</MenuItem>
                {fillCategory()}
              </Select>
              <FormHelperText style={{ color: "#d32f2f" }}>
                {resError?.categoryId?.message}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label={"Food Item Name"}
              fullWidth
              onFocus={() => handleError(false, "foodItemName", "")}
              error={resError?.foodItemName?.error}
              helperText={resError?.foodItemName?.message}
              onChange={(event) => setFoodItemName(event.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl>
              <FormLabel>Food Type</FormLabel>
              <RadioGroup row>
                <FormControlLabel
                  value="Veg"
                  control={<Radio />}
                  label="Veg"
                  onChange={(event) => setFoodType(event.target.value)}
                />
                <FormControlLabel
                  value="Non-Veg"
                  control={<Radio />}
                  label="Non Veg"
                  onChange={(event) => setFoodType(event.target.value)}
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={"Ingredients"}
              fullWidth
              onFocus={() => handleError(false, "price", "")}
              error={resError?.ingredients?.error}
              helperText={resError?.ingredients?.message}
              onChange={(event) => setIngredients(event.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label={"Price"}
              fullWidth
              onFocus={() => handleError(false, "price", "")}
              error={resError?.price?.error}
              helperText={resError?.price?.message}
              onChange={(event) => setPrice(event.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label={"Offer Price"}
              fullWidth
              onFocus={() => handleError(false, "price", "")}
              error={resError?.offerPrice?.error}
              helperText={resError?.offerPrice?.message}
              onChange={(event) => setOfferPrice(event.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <Button
              component={"label"}
              variant={"contained"}
              endIcon={<UploadFile />}
              fullWidth
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleIcon}
              />
              Upload Icon
            </Button>
          </Grid>
          <Grid item xs={6} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={iconData.url}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>

          <Grid item xs={6}>
            <Button variant="contained" onClick={handleSubmit} fullWidth>
              Submit
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" fullWidth>
              Reset
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
