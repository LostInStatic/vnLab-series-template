import styled from "styled-components"
import atoms from "~components/atoms"
import { devices } from "~styles/breakpoints"
import { InnerGrid } from "~styles/grid"

export const EdtitionWrapper = styled(InnerGrid)`
  margin-bottom: ${({ theme: { spacing } }) => spacing.sm};
`

export const Text = styled(atoms.p)`
  grid-row: 1;
  grid-column: 1 / 6;

  @media ${devices.laptop} {
    grid-column: 1 / 4;
  }
`

export const Button = styled(atoms.button)`
  padding-bottom: 2px;
  padding-top: 2px;
  font-weight: 400;
  text-transform: none;
  vertical-align: middle;
  width: fit-content;
  grid-row: 1;
  grid-column: 6 / -1;

  @media ${devices.laptop} {
    grid-column: 4 / -1;
  }
`