import Header from "../components/Header";
import InicioAdmin from "../components/InicioAdmin";
import TableCitasNoAuthAdmin from "../components/TableCitasNoAuthAdmin";
import Footer from "../components/footer";

const HomeAdmin = () => {
    return (
        <div>
            <Header />
            <InicioAdmin/>
            {/* <TableCitasNoAuthAdmin /> */}
            <Footer />
        </div>
    );
};

export default HomeAdmin; 