import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import type { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';
/* import data from '../utils/data'; */
import db from '../utils/db';
import Product from '../models/Product';

const Home = (props: any) => {
  const { products } = props;

  return (
    <Layout>
      <div>
        <h1>Produkte</h1>

        <Grid container spacing={3}>
          {products.map((product: any) => {
            return (
              <Grid item md={4} key={product.name}>
                <Link href={`/product/${product.slug}`} passHref>
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={product.image}
                        title={product.name}
                      />
                      <CardContent>
                        <Typography>{product.name}</Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Typography>CHF {product.price}</Typography>
                      <Button size="small" color="primary">
                        Hinzufügen
                      </Button>
                    </CardActions>
                  </Card>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();

  products.map((product) => {
    product._id = String(products[0]._id);
    product.createdAt = String(products[0].createdAt);
    product.updatedAt = String(products[0].updatedAt);
  });

  return {
    props: {
      products: products,
    },
  };
};
