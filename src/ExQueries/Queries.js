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
      positionName
      positionFloor
      createdAt
      modifyAt
      status
    }
  }
`;

const getposition = gql`
  {
    getPosis {
      id
      name
      floor
      status
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
    $status: String!
    $positionName: String!
    $positionFloor: String!
  ) {
    createPc(
      input: {
        name: $name
        sertag: $sertag
        assettag: $assettag
        ip: $ip
        vlan: $vlan
        status: $status
        positionName: $positionName
        positionFloor: $positionFloor
      }
    ) {
      id
      name
      sertag
      assettag
      ip
      vlan
      status
      createdAt
      positionName
      positionFloor
    }
  }
`;

const createPosi = gql`
  mutation createPosi($name: String!, $floor: String!, $status: String!) {
    createPosi(input: { name: $name, floor: $floor, status: $status }) {
      id
      name
      floor
      status
    }
  }
`;

const getPosi = gql`
  query($posiId: ID!) {
    getPosi(posiId: $posiId) {
      id
      name
      floor
      status
    }
  }
`;

export { getPcs, getposition, createPc, createPosi, getPosi };
