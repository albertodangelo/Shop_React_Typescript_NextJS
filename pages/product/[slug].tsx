import NextLink from 'next/link';
/* import { useRouter } from 'next/router'; */
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
/* import data from '../../utils/data'; */
import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  Card,
  Button,
} from '@material-ui/core';
import useStyles from '../../utils/styles';
import Image from 'next/image';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { ParsedUrlQuery } from 'querystring';
import { URLSearchParams } from 'url';

export default function ProductScreen(props: any) {
  const classes = useStyles();

  const { dispatch } = useContext(Store);

  /* const router = useRouter();
  const { slug } = router.query;
  const product = data.products.find((product) => product.slug === slug);
 */
  const { product } = props;

  console.log(product);

  if (!product) {
    return <h1>product not found</h1>;
  }

  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock <= 0) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } });
  };

  return (
    <Layout title={product.name} description={product.description}>
      <>
        <div className={classes.section}>
          <NextLink href={'/'} passHref>
            <Link>
              <Typography>back to products</Typography>
            </Link>
          </NextLink>
        </div>
        <Grid container>
          <Grid item md={6} xs={12}>
            <Image
              src={product.image}
              width={640}
              height={640}
              layout="responsive"
              alt="product detail"
            ></Image>
          </Grid>
          <Grid item md={3} xs={12}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  {product.name}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>Brand: {product.brand}</Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  Rating: {product.rating} stars of ({product.numReviews}{' '}
                  reviews)
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>Description: {product.description}</Typography>
              </ListItem>
            </List>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>EUR {product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'in Stock' : 'Unavailable'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  Add to cart
                </Button>
              </ListItem>
            </Card>
          </Grid>
        </Grid>
      </>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const { slug }: any = params;

  console.log(slug);

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  product._id = String(product._id);
  product.createdAt = String(product.createdAt);
  product.updatedAt = String(product.updatedAt);

  return {
    props: {
      product: product,
    },
  };
};
