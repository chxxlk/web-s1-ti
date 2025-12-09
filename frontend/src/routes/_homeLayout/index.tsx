import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import carousel1 from "@/assets/Carousel1.png";
import carousel2 from "@/assets/Carousel2.png";
import { Button } from "@/components/ui/button";
import alfaLogo from "@/assets/alfamartLogo.png";
import ctiLogo from "@/assets/ctiLogo.png";
import puraLogo from "@/assets/puraLogo.png";
import sinarmasLogo from "@/assets/sinarmasLogo.png";
import bcaLogo from "@/assets/bcaLogo.png";
import siasatLink from "@/assets/siasatLink.png";
import aitiLink from "@/assets/aitiLink.png";
import libraryLink from "@/assets/libraryLink.png";
import sitaLink from "@/assets/sitaLink.png";
import itexploreLink from "@/assets/itexploreLink.jpg";
import Footer from "@/components/ui/custom/footer/footer";
import { useFetchAnnouncementsPaginated } from "@/features/announcement/hooks/useFetchAnnouncementsPaginated";
import SkeletonCardDisplay from "@/features/shared/components/skeletonCardDisplay";
import AnnouncementCardDisplay from "@/features/announcement/components/announcementCardDisplay";


export const Route = createFileRoute("/_homeLayout/")({
  component: Index,
});

function Index() {
  const { data: announcements, isLoading: isFetchAnnouncementLoading } =
    useFetchAnnouncementsPaginated({ per_page: 3, sort_by: "latest", page: 1 });
    return (
    <div>
      {/* Carousel */}
      <div className="mx-auto w-full">
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <img
                src={carousel1}
                alt="Image 1"
                className="w-full h-screen max-h-[500px] object-cover"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                src={carousel2}
                alt="Image 2"
                className="w-full h-screen max-h-[500px] object-cover"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                src={carousel1}
                alt="Image 3"
                className="w-full h-screen max-h-[500px] object-cover"
              />
            </CarouselItem>
          </CarouselContent>
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center gap-4 mt-6 px-8">
        <Link
          to="/vacancy"
          className="flex justify-center items-center w-full md:w-1/3 h-12"
        >
          <Button className="w-full">Lowongan Asisten Dosen</Button>
        </Link>
        <Link
          to="/studentsAssociationInfo"
          className="flex justify-center items-center w-full md:w-1/3 h-12"
        >
          <Button className="w-full">Himpunan</Button>
        </Link>
      </div>

      {/* Bagian Pengumuman */}
      <div className="container mx-auto px-8 py-8 ">
        {/* Heading Pengumuman */}
        <div className="text-center mt-20 mb-10">
          <h2 className="text-3xl font-semibold">Pengumuman</h2>
        </div>

        {/* Card Grid */}
        {isFetchAnnouncementLoading ? (
          <SkeletonCardDisplay amount={3} />
        ) : (
          <AnnouncementCardDisplay announcements={announcements?.data ?? []} />
        )}
      </div>

      {/* Tombol Selengkapnya */}
      {announcements && announcements.data.length > 0 && (
        <div className="container mx-auto flex justify-center px-8">
          <Link to="/announcement" className="w-full text-center">
            <Button variant="outline" className="">
              Lihat Lebih Banyak
            </Button>
          </Link>
        </div>
      )}

      {/* Bagian Kerja Sama */}
      <div className="container mx-auto px-8 py-8">
        <div className="text-center my-16">
          <h2 className="text-3xl font-semibold">Kerja Sama</h2>
        </div>

        <div className="container flex items-center justify-center flex-col md:flex-row mx-auto gap-28 px-4 mt-6 ">
          {/* <div className="justify-center gap-28 items-center "> */}
          {/* Logo Alfamart */}
          <a
            href="https://www.alfamart.co.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 transform hover:scale-110 hover:rotate-3"
          >
            <img src={alfaLogo} alt="Alfamart" className="w-32 h-auto" />
          </a>

          {/* Logo CTI Group */}
          <a
            href="https://www.ctigroup.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 transform hover:scale-110 hover:rotate-3"
          >
            <img src={ctiLogo} alt="CTI Group" className="w-32 h-auto" />
          </a>

          {/* Logo Pura */}
          <a
            href="https://www.pura.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 transform hover:scale-110 hover:rotate-3"
          >
            <img src={puraLogo} alt="Pura" className="w-32 h-auto" />
          </a>

          {/* Logo Sinarmas */}
          <a
            href="https://www.sinarmas.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 transform hover:scale-110 hover:rotate-3"
          >
            <img src={sinarmasLogo} alt="Sinarmas" className="w-32 h-auto" />
          </a>

          {/* Logo BCA */}
          <a
            href="https://www.bca.co.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 transform hover:scale-110 hover:rotate-3"
          >
            <img src={bcaLogo} alt="BCA" className="w-32 h-auto" />
          </a>
          {/* </div> */}
        </div>
      </div>

      {/*Bagian Profil Singkat*/}
      <div className="container mx-auto px-8 py-8">
        {/* Heading di luar Card */}
        <h2 className="text-3xl font-semibold text-center">
          Teknik Informatika UKSW
        </h2>

        {/* Card untuk Deskripsi dan Video */}
        <div className="flex flex-col md:flex-row  items-center mt-8 ">
          {/* Deskripsi */}
          <div className="flex-1 order-2 md:order-1 text-center md:text-left mt-4 md:mt-0">
            <p className="text-lg text-foreground">
              Program Studi Teknik Informatika UKSW adalah program studi yang
              berfokus pada pengembangan teknologi informasi dan komputer.
            </p>
            <p className="text-lg text-foreground mt-4">
              Kami menyediakan pendidikan berkualitas tinggi yang mempersiapkan
              mahasiswa untuk menjadi profesional IT yang kompeten dan inovatif.
            </p>
          </div>

          {/* Video */}
          <div className="flex-1 order-1 md:order-2 w-full">
            <iframe
              className="w-full h-96 rounded-xl shadow-md"
              src="https://www.youtube.com/embed/8e2l1ULOSjo"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/*Bagian Layanan Kampus*/}
      <div className="container mx-auto px-8 py-8">
        {/* Heading Layanan Kampus */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Layanan Kampus</h2>
        </div>

        {/* Gambar Layanan Kampus */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
          {/* Gambar 1 */}
          <div className="w-full py-4">
            <a
              href="https://siasat.uksw.edu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={siasatLink}
                alt="Layanan 1"
                className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>

          {/* Gambar 2 */}
          <div className="w-full py-4">
            <a
              href="http://online.fti.uksw.edu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={sitaLink}
                alt="Layanan 2"
                className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>

          {/* Gambar 3 */}
          <div className="w-full py-4">
            <a
              href="https://ejournal.uksw.edu/itexplore"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={itexploreLink}
                alt="Layanan 3"
                className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>

          {/* Gambar 4 */}
          <div className="w-full py-4">
            <a
              href="https://library.uksw.edu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={libraryLink}
                alt="Layanan 4"
                className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>

          {/* Gambar 5 */}
          <div className="w-full py-4">
            <a
              href="https://ejournal.uksw.edu/aiti"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={aitiLink}
                alt="Layanan 5"
                className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>
        </div>
      </div>

      {/*Bagian Footer*/}
      <Footer />
    </div>
  );
}
