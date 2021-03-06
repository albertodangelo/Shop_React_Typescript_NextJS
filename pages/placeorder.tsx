import {
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableCell,
  TableBody,
  Link,
  Button,
  ListItem,
  Card,
  List,
  CircularProgress,
} from '@material-ui/core';
import React, {  useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
import useStyles from '../utils/styles';
import CheckoutWizard from '../components/CheckoutWizard';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/errors';
import axios from 'axios';
import Cookies from 'js-cookie';

function PlaceOrder() {
  
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [ loading, setLoading] = useState(false);
  
  console.log(cartItems);

  const round2 = (num:number) => Math.round(num*100 + Number.EPSILON)/100; // 123.456 => 123.46
  const itemPrice = round2(cartItems.reduce((a:number, c:any) => a + c.price * c.quantity, 0));
  const shippingPrice = itemPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemPrice * 0.15);
  const totalPrice = itemPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if(cartItems.length === 0) {
      router.push('/cart');
    }
  }, [paymentMethod]);


  const placeOrderHandler = async () => {

    closeSnackbar();
    
    try {
      setLoading(true);
      const { data } = await axios.post('api/order', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      }, {
        headers: {
          authorization: `Baerer ${userInfo.token}`
        }
      })

      dispatch({ type: 'CART_CLEAR'})
      Cookies.remove('cartItems');
      setLoading(false);
      router.push(`order/${data._id}`);

    } catch (err) {
      setLoading(false);
      enqueueSnackbar( getError(err), { variant: "error"}); 
    }
    
  }

  return (
    <Layout title="Place Order">
      <>
      <CheckoutWizard activeStep={3}></CheckoutWizard>

        <Typography variant="h1" component="h1">
          Place Order
        </Typography>
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
            <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h2" variant='h2'>
                      Shipping Address
                    </Typography>
                  </ListItem>
                  <ListItem>
                    {shippingAddress.fullName}, {shippingAddress.address}, {' '}
                    {shippingAddress.city}, {shippingAddress.postalCode}, {' '}
                    {shippingAddress.country}
                  </ListItem>
                </List>
              </Card>  
            <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h2" variant='h2'>
                      Payment Method
                    </Typography>
                  </ListItem>
                  <ListItem>
                    {paymentMethod}
                  </ListItem>
                </List>
              </Card>  
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h2" variant='h2'>
                      Order Items
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map((item: any) => {
                          return (
                            <TableRow key={item._id}>
                              <TableCell>
                                <NextLink href={`/product/${item.slug}`} passHref>
                                  <Link>
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={50}
                                      height={50}
                                    ></Image>
                                  </Link>
                                </NextLink>
                              </TableCell>
                              <TableCell>
                                <NextLink href={`/product/${item.slug}`} passHref>
                                  <Link>
                                    <Typography>{item.slug}</Typography>
                                  </Link>
                                </NextLink>
                              </TableCell>
                              <TableCell align="right">
                                <Typography>
                                  {item.quantity}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography>
                                  ${item.price}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                              
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  </ListItem>
                </List>
                
              </Card>
              
            </Grid>
            <Grid item md={3} xs={12}>
              <Card  className={classes.section}>
                <List>
                  <ListItem>
                    <Typography variant="h2">
                        Order summery
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>
                          Items: 
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          ${itemPrice} 
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>
                          Tax: 
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          ${taxPrice} 
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>
                          Shipping: 
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          ${shippingPrice} 
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>
                          <strong>Total:</strong> 
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                           <strong>${totalPrice}</strong> 
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={placeOrderHandler}
                    >
                      Place order
                    </Button>
                  </ListItem>
                  { loading && (
                    <ListItem>
                      <CircularProgress></CircularProgress>
                    </ListItem>
                    
                  )}
                </List>
              </Card>
            </Grid>
          </Grid>
      </>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
