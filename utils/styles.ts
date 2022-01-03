const { makeStyles } = require('@material-ui/core');

const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#203040',
    '& a': {
      color: '#fff',
      margingLeft: 10,
    },
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '2rem',
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    textAlign: 'center',
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default useStyles;
