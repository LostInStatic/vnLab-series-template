import styled, { css } from "styled-components"
import atoms from "~components/atoms"

export const QuoteContainer = styled.article`
  ${({ theme: { spacing, palette } }) => css`
    border-top: 1px solid ${palette.medium};
    border-bottom: 1px solid ${palette.medium};
    padding: ${spacing.md} 0px;
    width: 100%;
    }
  `}
`

export const QuoteText = styled(atoms.p)`
  ${({ theme: { typography, palette } }) => css`
    font-family: ${typography.fonts.secondary};
    font-size: ${typography.lg};
    color: ${palette.black};
  `}
`

export const Author = styled(atoms.h3)`
  margin-top: ${({ theme: { spacing } }) => spacing.sm};
  text-align: end;
`
