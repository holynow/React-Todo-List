import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import {
  Link,
  Outlet,
  useLocation,
  useMatch,
  useParams,
} from "react-router-dom";

import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { isDarkAtom } from "../atom";
import { useAtomValue } from "jotai";

const Container = styled.div`
  padding: 0 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  display: block;
  text-align: center;
`;

const Overview = styled.div<{ isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.isDark ? "rgba(0, 0, 0, 0.4)" : "#ddd"};
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const TabButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;
const TabBtn = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  background-color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.enabledColor};
  border-radius: 10px;
  color: ${(props) => props.theme.bgColor};
  font-weight: 600;
  transition: background-color 0.2s ease-in;

  &:hover {
    background-color: ${(props) => props.theme.accentColor + "aa"};
  }
  a {
    display: block;
    width: 100%;
    padding: 10px 0px;
  }
`;
const BackButton = styled.span`
  a {
    display: inline-block;
    margin-top: 25px;
    color: ${(props) => props.theme.accentColor};
    font-weight: 600;
    font-size: 16px;
  }
`;

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  links: object;
  links_extended: object;
  whitepaper: object;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: number;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

const Coin = () => {
  const isDark = useAtomValue(isDarkAtom);
  const { coinId } = useParams<{ coinId: string }>();
  const { state } = useLocation();
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>({
    queryKey: ["info", coinId],
    queryFn: () => fetchCoinInfo(coinId!),
  });
  const { isLoading: tickerLoading, data: tickersData } = useQuery<PriceData>({
    queryKey: ["tickers", coinId],
    queryFn: () => fetchCoinTickers(coinId!),
    // refetchInterval: 5000,
  });

  const loading = infoLoading || tickerLoading;
  return (
    <Container>
      <BackButton>
        <Link to="/"> &larr; Back</Link>
      </BackButton>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview isDark={isDark}>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price</span>
              <span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview isDark={isDark}>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <TabButtonWrapper>
            <TabBtn isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </TabBtn>
            <TabBtn isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </TabBtn>
          </TabButtonWrapper>
          <Outlet context={coinId} />
        </>
      )}
    </Container>
  );
};

export default Coin;
