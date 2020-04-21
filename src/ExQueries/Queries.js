import gql from "graphql-tag";

const getPcs = gql`
  {
    getPcs {
      id
      name
      sertag
      assettag
      vlan
      ip
      posiId
      createdAt
      modifyAt
    }
  }
`;

const getposition = gql`
  {
    getPosis {
      id
      name
      floor
    }
  }
`;

const createPc = gql`
  mutation createPc(
    $name: String!
    $sertag: String!
    $assettag: String!
    $ip: String!
    $vlan: String!
    $posiId: String!
  ) {
    createPc(
      input: {
        name: $name
        sertag: $sertag
        assettag: $assettag
        ip: $ip
        vlan: $vlan
        posiId: $posiId
      }
    ) {
      id
      name
      sertag
      assettag
      ip
      vlan
      createdAt
      posiId
    }
  }
`;

const createPosi = gql`
  mutation createPosi($name: String!, $floor: String!) {
    createPosi(input: { name: $name, floor: $floor }) {
      id
      name
      floor
    }
  }
`;

const getPosi = gql`
  query($posiId: ID!) {
    getPosi(posiId: $posiId) {
      id
      name
      floor
    }
  }
`;

export { getPcs, getposition, createPc, createPosi, getPosi };
